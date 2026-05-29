const express = require('express');
const router = express.Router();
const db = require('../config/database');
const cache = require('../config/redis');
const logger = require('../utils/logger');
const analyzeMatch = require('../services/analyzer');
const auth = require('../middleware/auth');

// Get match analysis
router.get('/match/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const cacheKey = `analysis:${matchId}`;

    // Check cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Get match data
    const matchResult = await db.query(
      'SELECT * FROM matches WHERE id = $1',
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    // Analyze match
    const analysis = await analyzeMatch(match);

    // Cache for 30 minutes
    await cache.setex(cacheKey, 1800, JSON.stringify(analysis));

    res.json(analysis);
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Get value bets
router.get('/value-bets', auth, async (req, res) => {
  try {
    const cacheKey = 'value-bets:daily';
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await db.query(
      `SELECT * FROM analyses WHERE value_bet = true AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC`
    );

    await cache.setex(cacheKey, 3600, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    logger.error('Value bets error:', error);
    res.status(500).json({ error: 'Failed to fetch value bets' });
  }
});

module.exports = router;
