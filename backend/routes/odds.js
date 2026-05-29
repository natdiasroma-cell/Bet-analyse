const express = require('express');
const router = express.Router();
const db = require('../config/database');
const cache = require('../config/redis');
const logger = require('../utils/logger');

// Get odds for a match
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const cacheKey = `odds:${matchId}`;

    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await db.query(
      `SELECT * FROM odds WHERE match_id = $1 ORDER BY bookmaker ASC`,
      [matchId]
    );

    await cache.setex(cacheKey, 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    logger.error('Odds error:', error);
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
});

// Compare odds across bookmakers
router.get('/compare/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const cacheKey = `odds:compare:${matchId}`;

    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await db.query(
      `SELECT DISTINCT ON (bet_type) * FROM odds WHERE match_id = $1 ORDER BY bet_type, odds DESC`,
      [matchId]
    );

    await cache.setex(cacheKey, 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    logger.error('Compare odds error:', error);
    res.status(500).json({ error: 'Failed to compare odds' });
  }
});

module.exports = router;
