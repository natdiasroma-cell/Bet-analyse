import axios from 'axios';
import cheerio from 'cheerio';
import logger from '../utils/logger';

class SofascoreScraperService {
  constructor() {
    this.baseURL = 'https://www.sofascore.com/api/v1';
  }

  /**
   * Get live matches
   */
  async getLiveMatches() {
    try {
      const response = await axios.get(`${this.baseURL}/sport/football/events/live`);
      return response.data.events;
    } catch (error) {
      logger.error('SofaScore live matches error:', error);
      throw error;
    }
  }

  /**
   * Get match details
   */
  async getMatchDetails(matchId) {
    try {
      const response = await axios.get(`${this.baseURL}/event/${matchId}`);
      return response.data.event;
    } catch (error) {
      logger.error('SofaScore match details error:', error);
      throw error;
    }
  }

  /**
   * Get match statistics
   */
  async getMatchStats(matchId) {
    try {
      const response = await axios.get(`${this.baseURL}/event/${matchId}/statistics`);
      return response.data.statistics;
    } catch (error) {
      logger.error('SofaScore stats error:', error);
      throw error;
    }
  }
}

module.exports = new SofascoreScraperService();
