import { Conversation } from '../models/conversationModel.js';
import { Message } from '../models/messageModel.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { getFromCache, setInCache } from '../redis/redisUtils.js'; // Import the Redis utility functions
import path from 'path';
import fs from 'fs';

// Controller for sending a message (text and/or image)
export const sendMessage = async (req, res) => {
	try {
		const senderId = req.id; // ID of the user sending the message
		const receiverId = req.params.id; // ID of the user receiving the message
		const { message } = req.body; // Text message content

		let imageUrl = null; // Initialize image URL variable
		let base64Image = null; // Initialize base64 image variable

		if (req.file) {
			const imagePath = path.join(process.cwd(), 'uploads', req.file.filename); // Use process.cwd() for absolute path
			// console.log('imagePath: ', imagePath);
			const imageData = fs.readFileSync(imagePath); // Read the image data
			// console.log('imageData: ', imageData);
			base64Image = `data:${req.file.mimetype};base64,${imageData.toString('base64')}`; // Convert to base64 string
			imageUrl = `/uploads/${req.file.filename}`; // Create the image URL
		}

		console.log('Sender ID:', senderId);
		console.log('Receiver ID:', receiverId);
		console.log('Message:', message);
		console.log('Uploaded Image URL:', imageUrl);
		// console.log('Base64 Image:', base64Image); // Log base64 image for verification

		// Find or create a conversation between sender and receiver
		let gotConversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!gotConversation) {
			gotConversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Create a new message document
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message,
			imageUrl, // Include the image URL if available
			base64Image, // Include base64 image if needed
		});

		if (newMessage) {
			gotConversation.messages.push(newMessage._id); // Add the message to the conversation
		}

		// Save both the conversation and message to the database
		await Promise.all([gotConversation.save(), newMessage.save()]);

		// Emit the new message to the receiver in real-time using Socket.io
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit('newMessage', newMessage);
		}

		// Respond with the newly created message
		return res.status(201).json({
			success: true,
			message: 'Message sent successfully',
			newMessage,
			imageUploaded: !!imageUrl, // Return true if an image was uploaded
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getMessage = async (req, res) => {
	try {
		const receiverId = req.params.id;
		const senderId = req.id;

		const conversationKey = `conversation:${senderId}:${receiverId}`;

		// Try to get the conversation from Redis
		const cachedConversation = await getFromCache(conversationKey);

		if (cachedConversation) {
			console.log('Cache hit for conversation');
			const messagePromises = cachedConversation.messages.map(messageId => {
				const messageKey = `message:${messageId}`;
				return getFromCache(messageKey);
			});
			const cachedMessages = await Promise.all(messagePromises);
			if (cachedMessages.every(msg => msg !== null)) {
				console.log('Cache hit for all messages');
				return res.status(200).json(cachedMessages);
			}
		}

		console.log('Cache miss');
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		}).populate('messages');

		if (conversation) {
			// Store the conversation and individual messages in Redis
			await setInCache(conversationKey, conversation);
			const messagePromises = conversation.messages.map(async message => {
				const messageKey = `message:${message._id}`;
				await setInCache(messageKey, message);
				return message;
			});
			const messages = await Promise.all(messagePromises);
			return res.status(200).json(messages);
		}

		return res.status(404).json({ message: 'Conversation not found' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
