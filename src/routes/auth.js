import express from 'express';
const router=express.Router();

import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/register', authController.register);
router.post('/login',    authController.login);
router.get ('/me',       authMiddleware, authController.getMe);
router.post('/logout',   authMiddleware, authController.logout);


export default router;