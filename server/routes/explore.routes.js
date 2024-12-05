import express from 'express'; 
import dotenv from 'dotenv';
import { getExploreContent } from '../controllers/explore.controller.js';

const router = express.Router();
dotenv.config()

router.post('/explore-content', getExploreContent)

export default router;