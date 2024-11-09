import React, { useEffect, useState } from 'react';
import SendInput from './SendInput';
import Messages from './Messages';
import { useSelector } from 'react-redux';

const MessageContainer = () => {
	const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
	const [lastSeen, setLastSeen] = useState('');

	const isOnline = onlineUsers?.includes(selectedUser?._id);

	useEffect(() => {
		// Update the last seen text when the user is offline
		if (!isOnline && selectedUser?.lastSeen) {
			const lastSeenDate = new Date(selectedUser.lastSeen);
			const now = new Date();
			let lastSeenText;

			// Calculate the difference between now and lastSeenDate
			const diffInMinutes = Math.floor((now - lastSeenDate) / 60000);

			if (diffInMinutes < 1) {
				lastSeenText = 'Last seen just now';
			} else if (diffInMinutes < 60) {
				lastSeenText = `Last seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
			} else if (diffInMinutes < 1440) {
				lastSeenText = `Last seen at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
			} else {
				lastSeenText = `Last seen on ${lastSeenDate.toLocaleDateString()} at ${lastSeenDate.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				})}`;
			}

			setLastSeen(lastSeenText);
		}
	}, [isOnline, selectedUser]);

	return (
		<>
			{selectedUser !== null ? (
				<div className="md:min-w-[550px] flex flex-col">
					<div className="flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
						<div className={`avatar ${isOnline ? 'online' : ''}`}>
							<div className="w-12 rounded-full">
								<img src={selectedUser?.profilePhoto} alt="user-profile" />
							</div>
						</div>
						<div className="flex flex-col flex-1">
							<div className="flex justify-between gap-2">
								<p>{selectedUser?.fullName}</p>
							</div>
							<div className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>{isOnline ? 'Online' : lastSeen}</div>
						</div>
					</div>
					<Messages />
					<SendInput />
				</div>
			) : (
				<div className="md:min-w-[550px] flex flex-col justify-center items-center">
					<h1 className="text-4xl text-white font-bold">Hi, {authUser?.fullName}</h1>
					<h1 className="text-2xl text-white">Let's start a conversation</h1>
				</div>
			)}
		</>
	);
};

export default MessageContainer;
