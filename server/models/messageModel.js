import mongoose from 'mongoose';

const messageModel = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			required: false, // Make it optional to support image-only messages
		},
		imageUrl: {
			// Store image URL
			type: String, // Change to string to hold the URL of the image
			required: false, // Optional
		},
		base64Image: {
			// Optional: store base64 image if needed
			type: String, // Base64 string for the image
			required: false, // Optional
		},
	},
	{ timestamps: true }
);

export const Message = mongoose.model('Message', messageModel);
