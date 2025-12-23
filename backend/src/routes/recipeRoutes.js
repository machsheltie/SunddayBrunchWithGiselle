import express from 'express';
import { recipeController } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', recipeController.getAllRecipes);
router.get('/:slug', recipeController.getRecipeBySlug);

export default router;
