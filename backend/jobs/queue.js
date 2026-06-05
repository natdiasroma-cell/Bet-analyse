const Queue = require('bull');
const logger = require('../../utils/logger');
const FootyStatsService = require('../scrapers/footystats');
const OddsPortalService = require('../scrapers/oddsportal');
const db = require('../../config/database');

// Create job queues
const matchesQueue = new Queue('fetch-matches', process.env.REDIS_URL);
const analysisQueue = new Queue('analyze-matches', process.env.REDIS_URL);
const oddsQueue = new Queue('fetch-odds', process.env.REDIS_URL);

/**
 * Process matches fetching job
 */
matchesQueue.process(async (job) => {
  try {
    logger.info('Fetching matches...');
    const matches = await FootyStatsService.getUpcomingMatches('football');

    // Store matches in database
    for (const match of matches) {
      await db.query(
        `INSERT INTO matches (sport, home_team, away_team, start_time, league, country, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          'football',
          match.homeTeam,
          match.awayTeam,
          new Date(match.startTime),
          match.league,
          match.country,
          'upcoming'
        ]
      );
    }

    logger.info(`Fetched and stored ${matches.length} matches`);
    return { success: true, count: matches.length };
  } catch (error) {
    logger.error('Matches fetching job error:', error);
    throw error;
  }
});

/**
 * Process analysis job
 */
analysisQueue.process(async (job) => {
  try {
    const { matchId } = job.data;
    logger.info(`Analyzing match ${matchId}...`);

    const matchResult = await db.query('SELECT * FROM matches WHERE id = $1', [matchId]);
    if (matchResult.rows.length === 0) {
      logger.warn(`Match ${matchId} not found`);
      return;
    }

    const match = matchResult.rows[0];
    const analyzer = require('../analyzer');
    const analysis = await analyzer.analyzeMatch(match);

    // Store analysis
    await db.query(
      `INSERT INTO analyses (match_id, analysis_data, value_bet, risk_level)
       VALUES ($1, $2, $3, $4)`,
      [
        matchId,
        JSON.stringify(analysis),
        analysis.valueBets.length > 0,
        analysis.riskLevel
      ]
    );

    logger.info(`Completed analysis for match ${matchId}`);
    return { success: true, analysisId: matchId };
  } catch (error) {
    logger.error('Analysis job error:', error);
    throw error;
  }
});

/**
 * Process odds fetching job
 */
oddsQueue.process(async (job) => {
  try {
    const { matchId } = job.data;
    logger.info(`Fetching odds for match ${matchId}...`);

    const matchResult = await db.query('SELECT * FROM matches WHERE id = $1', [matchId]);
    if (matchResult.rows.length === 0) return;

    const match = matchResult.rows[0];
    const odds = await OddsPortalService.getOdds(match.home_team, match.away_team);

    // Store odds
    for (const [bookmaker, oddValues] of Object.entries(odds)) {
      await db.query(
        `INSERT INTO odds (match_id, bookmaker, bet_type, odds)
         VALUES ($1, $2, $3, $4)`,
        [matchId, bookmaker, '1x2', JSON.stringify(oddValues)]
      );
    }

    logger.info(`Stored odds for match ${matchId}`);
    return { success: true };
  } catch (error) {
    logger.error('Odds fetching job error:', error);
    throw error;
  }
});

/**
 * Schedule jobs
 */
async function scheduleJobs() {
  try {
    // Fetch matches every 30 minutes
    await matchesQueue.add({}, { repeat: { every: 30 * 60 * 1000 } });

    // Fetch odds every 5 minutes
    await oddsQueue.add({}, { repeat: { every: 5 * 60 * 1000 } });

    logger.info('Jobs scheduled successfully');
  } catch (error) {
    logger.error('Job scheduling error:', error);
  }
}

module.exports = {
  matchesQueue,
  analysisQueue,
  oddsQueue,
  scheduleJobs
};
