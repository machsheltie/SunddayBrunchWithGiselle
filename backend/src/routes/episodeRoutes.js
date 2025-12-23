import express from 'express';
import { episodeController } from '../controllers/episodeController.js';

const router = express.Router();

router.get('/', episodeController.getAllEpisodes);
router.get('/:slug', episodeController.getEpisodeBySlug);

export default router;
