import express from 'express';
import dotenv from 'dotenv';

import { signUp, login, logout, authCheck, generatePassword } from '../controllers/auth.controllers.js'
import { protectRoute } from '../middleware/protectRoutes.js';

const router = express.Router();
dotenv.config()

router.post('/signup', signUp)

router.post('/login', login)

router.post('/logout', logout)

router.post('/generate-password', generatePassword)

router.get('/authCheck', protectRoute, authCheck)

export default router;