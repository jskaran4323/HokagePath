import express from 'express';
import { register, login, getMe, logout } from '../../v1/controllers/authController';

import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/logout',logout )

export default router;