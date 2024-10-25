// routes/messageRoute.js
import express from 'express';
import { getMessage, sendMessage } from '../controllers/messageController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Send message route with image upload
router
	.route('/send/:id')
	.post(isAuthenticated, upload.single('image'), sendMessage);
router.route('/:id').get(isAuthenticated, getMessage);

export default router;
