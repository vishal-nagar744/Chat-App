import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '..';

const Message = ({ message, previousMessage }) => {
	const scroll = useRef();
	const { authUser, selectedUser } = useSelector(store => store.user);

	// State to keep track of last date header shown
	const [lastDateHeader, setLastDateHeader] = useState(null);

	// Scroll to the latest message
	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' });
	}, [message]);

	// Helper function to check if a date header should be shown
	const shouldShowDateHeader = () => {
		const currentDate = new Date(message.createdAt).setHours(0, 0, 0, 0); // Only date part, ignore time
		const lastHeaderDate = lastDateHeader?.setHours(0, 0, 0, 0); // Ignore time part

		if (!lastDateHeader) {
			setLastDateHeader(new Date(message.createdAt)); // Set the first message's date
			return true; // Show header for the first message
		}

		return currentDate !== lastHeaderDate; // Show header if the dates are different
	};

	// Format the date header as "Today," "Yesterday," or specific date
	const getDateHeader = timestamp => {
		const date = new Date(timestamp);
		const now = new Date();
		const yesterday = new Date();
		yesterday.setDate(now.getDate() - 1);

		if (date.toDateString() === now.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			return new Intl.DateTimeFormat('en-US', options).format(date);
		}
	};

	// Helper function to format the time
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
		<>
			{shouldShowDateHeader() && (
				<div className="date-header text-center my-2 text-gray-500">{getDateHeader(message.createdAt)}</div>
			)}
			<div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
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
					{message?.message && <p>{message.message}</p>}
					{message?.imageUrl && <img src={`${BASE_URL}${message.imageUrl}`} alt="Sent Image" className="mt-2 max-w-xs rounded-lg" />}
				</div>
			</div>
		</>
	);
};

export default Message;
