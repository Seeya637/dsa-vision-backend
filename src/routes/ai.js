import express from 'express';
import {chatWithSensei} from '../controllers/aiController.js';
const router=express.Router();
router.post('/chat',chatWithSensei);
export default router;
