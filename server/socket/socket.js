// socket/socket.js
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/userModel.js'; // Corrected import path

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
	},
});

const userSocketMap = {}; // {userId -> socketId}

io.on('connection', socket => {
	const userId = socket.handshake.query.userId;
	if (userId !== undefined) {
		userSocketMap[userId] = socket.id;

		// Update lastSeen to current time when user connects
		User.findByIdAndUpdate(userId, { lastSeen: Date.now() }, { new: true })
			.then(() => {
				io.emit('getOnlineUsers', Object.keys(userSocketMap));
			})
			.catch(err => console.error('Error updating lastSeen:', err));
	}

	socket.on('disconnect', () => {
		delete userSocketMap[userId];

		// Update lastSeen to current time when user disconnects
		User.findByIdAndUpdate(userId, { lastSeen: Date.now() }, { new: true })
			.then(() => {
				io.emit('getOnlineUsers', Object.keys(userSocketMap));
			})
			.catch(err => console.error('Error updating lastSeen:', err));
	});
});

export const getReceiverSocketId = receiverId => {
	return userSocketMap[receiverId];
};

export { app, io, server };
