import { Episode } from '../models/Episode.js';

export const episodeController = {
  /**
   * GET /api/episodes - Get all episodes
   */
  async getAllEpisodes(req, res) {
    try {
      const episodes = await Episode.findAll();
      res.json(episodes);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
  },

  /**
   * GET /api/episodes/:slug - Get episode by slug
   */
  async getEpisodeBySlug(req, res) {
    try {
      const { slug } = req.params;
      const episode = await Episode.findBySlug(slug);

      if (!episode) {
        return res.status(404).json({ error: 'Episode not found' });
      }

      res.json(episode);
    } catch (error) {
      console.error('Error fetching episode:', error);
      res.status(500).json({ error: 'Failed to fetch episode' });
    }
  }
};
