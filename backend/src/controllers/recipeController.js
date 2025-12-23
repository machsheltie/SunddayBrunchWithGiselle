import { Recipe } from '../models/Recipe.js';

export const recipeController = {
  /**
   * GET /api/recipes - Get all recipes
   */
  async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.findAll();
      res.json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  },

  /**
   * GET /api/recipes/:slug - Get recipe by slug
   */
  async getRecipeBySlug(req, res) {
    try {
      const { slug } = req.params;
      const recipe = await Recipe.findBySlug(slug);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      res.json(recipe);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  }
};
