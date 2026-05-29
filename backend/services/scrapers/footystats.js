import axios from 'axios';
import cheerio from 'cheerio';
import logger from '../utils/logger';

class FootystatsScraperService {
  constructor() {
    this.baseURL = 'https://www.footystats.com';
    this.apiKey = process.env.FOOTYSTATS_API_KEY;
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(sport = 'football') {
    try {
      const response = await axios.get(`${this.baseURL}/api/matches`, {
        headers: { 'X-API-KEY': this.apiKey }
      });

      return response.data.matches.filter(m => m.sport === sport && new Date(m.startTime) > new Date());
    } catch (error) {
      logger.error('FootyStats scraper error:', error);
      throw error;
    }
  }

  /**
   * Get team statistics
   */
  async getTeamStats(teamName) {
    try {
      const response = await axios.get(`${this.baseURL}/api/teams/${teamName}/stats`, {
        headers: { 'X-API-KEY': this.apiKey }
      });

      return response.data;
    } catch (error) {
      logger.error('Team stats error:', error);
      throw error;
    }
  }

  /**
   * Get head to head
   */
  async getHeadToHead(homeTeam, awayTeam) {
    try {
      const response = await axios.get(`${this.baseURL}/api/h2h`, {
        params: { home: homeTeam, away: awayTeam },
        headers: { 'X-API-KEY': this.apiKey }
      });

      return response.data;
    } catch (error) {
      logger.error('H2H error:', error);
      throw error;
    }
  }
}

module.exports = new FootystatsScraperService();
