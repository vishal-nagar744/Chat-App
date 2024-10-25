import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
	const scroll = useRef();
	const { authUser, selectedUser } = useSelector(store => store.user);

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' });
	}, [message]);

	return (
		<div
			ref={scroll}
			className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
		>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="User Avatar" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
				</div>
			</div>
			<div className="chat-header">
				<time className="text-xs opacity-50 text-white">12:45</time>
			</div>
			<div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''}`}>
				{message?.message && <p>{message.message}</p>}
				{/* Make sure to check for the correct property for the image URL */}
				{message?.imageUrl && (
					<img src={`http://localhost:8080${message.imageUrl}`} alt="Sent Image" className="mt-2 max-w-xs rounded-lg" />
				)}
			</div>
		</div>
	);
};

export default Message;
