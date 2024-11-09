import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '..';

const Message = ({ message }) => {
	const scroll = useRef();
	const { authUser, selectedUser } = useSelector(store => store.user);

	// Scroll to the latest message
	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' });
	}, [message]);

	// Function to format timestamp to "h:mm AM/PM"
	const formatTime = timestamp => {
		if (!timestamp) return 'Time Not Available';
		const date = new Date(timestamp);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 hours to 12 for AM/PM
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	};

	return (
		<div
			ref={scroll}
			className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
		>
			{/* User avatar */}
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="User Avatar" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
				</div>
			</div>

			{/* Display the message time */}
			<div className="chat-header">
				<time className="text-xs opacity-50 text-gray-500">{formatTime(message?.createdAt)}</time>
			</div>

			{/* Message content */}
			<div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''}`}>
				{/* Display text message if available */}
				{message?.message && <p>{message.message}</p>}

				{/* Display image if available */}
				{message?.imageUrl && (
					<img src={`${BASE_URL}${message.imageUrl}`} alt="Sent Image" className="mt-2 max-w-xs rounded-lg" />
				)}
			</div>
		</div>
	);
};

export default Message;
