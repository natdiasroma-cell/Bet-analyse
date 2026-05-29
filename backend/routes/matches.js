const express = require('express');
const router = express.Router();
const db = require('../config/database');
const cache = require('../config/redis');
const logger = require('../utils/logger');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const { sport = 'football', status = 'upcoming' } = req.query;
    const cacheKey = `matches:${sport}:${status}`;

    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    let query = 'SELECT * FROM matches WHERE sport = $1';
    const params = [sport];

    if (status === 'upcoming') {
      query += ' AND start_time > NOW()';
    } else if (status === 'live') {
      query += ' AND status = \'live\'';
    } else if (status === 'finished') {
      query += ' AND status = \'finished\'';
    }

    query += ' ORDER BY start_time DESC LIMIT 50';

    const result = await db.query(query, params);
    await cache.setex(cacheKey, 600, JSON.stringify(result.rows));

    res.json(result.rows);
  } catch (error) {
    logger.error('Matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get match details
router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const cacheKey = `match:${matchId}`;

    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await db.query('SELECT * FROM matches WHERE id = $1', [matchId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    await cache.setex(cacheKey, 600, JSON.stringify(result.rows[0]));
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Match details error:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

module.exports = router;
