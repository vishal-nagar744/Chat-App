// userModel.js
import mongoose from 'mongoose';

const userModel = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePhoto: {
			type: String,
			default: '',
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: true,
		},
		lastSeen: {
			// Add lastSeen property here
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model('User', userModel);
