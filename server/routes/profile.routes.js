import express from 'express';
import dotenv from 'dotenv';
import { updateProfileFields, addSkills } from '../controllers/profile.controllers.js';


const router = express.Router();
dotenv.config()

router.post("/update", updateProfileFields)
router.post("/add-skill", addSkills)

export default router; 