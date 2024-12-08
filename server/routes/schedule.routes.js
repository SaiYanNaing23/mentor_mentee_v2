import express from 'express';
import { removeExpiredSchedules } from '../controllers/schedule.controller.js';

const router = express.Router();

router.get('/remove', removeExpiredSchedules);

export default router;