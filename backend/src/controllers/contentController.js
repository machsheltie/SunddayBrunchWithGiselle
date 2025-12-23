import { Recipe } from '../models/Recipe.js';
import { Episode } from '../models/Episode.js';

export const contentController = {
  /**
   * GET /api/featured - Get featured recipe and episode
   */
  async getFeatured(req, res) {
    try {
      const recipes = await Recipe.findAll();
      const episodes = await Episode.findAll();

      const featured = {
        recipe: recipes[0] || null,
        episode: episodes[0] || null
      };

      res.json(featured);
    } catch (error) {
      console.error('Error fetching featured content:', error);
      res.status(500).json({ error: 'Failed to fetch featured content' });
    }
  }
};
