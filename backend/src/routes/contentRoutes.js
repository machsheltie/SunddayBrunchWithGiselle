import express from 'express';
import { contentController } from '../controllers/contentController.js';

const router = express.Router();

router.get('/featured', contentController.getFeatured);

export default router;
