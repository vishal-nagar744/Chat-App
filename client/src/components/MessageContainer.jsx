import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV } from 'react-icons/fa'; // Added ellipsis icon for the three-dot menu
import SendInput from './SendInput';
import Messages from './Messages';
import { useSelector } from 'react-redux';

const MessageContainer = () => {
	const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
	const [lastSeen, setLastSeen] = useState('');
	const [isCallModalOpen, setIsCallModalOpen] = useState(false);
	const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for managing dropdown visibility
	const dropdownRef = useRef(null); // Reference to the dropdown menu for detecting clicks outside

	const isOnline = onlineUsers?.includes(selectedUser?._id);

	// Close dropdown if clicked outside
	const handleClickOutside = useCallback(event => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsDropdownOpen(false); // Close dropdown if clicked outside
		}
	}, []);

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [handleClickOutside]);

	useEffect(() => {
		// Update the last seen text when the user is offline
		if (!isOnline && selectedUser?.lastSeen) {
			const lastSeenDate = new Date(selectedUser.lastSeen);
			const now = new Date();
			let lastSeenText;
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

	// Call modal handlers
	const openCallModal = useCallback(() => setIsCallModalOpen(true), []);
	const closeCallModal = useCallback(() => setIsCallModalOpen(false), []);
	const openVideoCallModal = useCallback(() => setIsVideoCallModalOpen(true), []);
	const closeVideoCallModal = useCallback(() => setIsVideoCallModalOpen(false), []);

	// Toggle dropdown visibility
	const toggleDropdown = useCallback(e => {
		e.stopPropagation(); // Prevent the click event from propagating to document (which would close the dropdown)
		setIsDropdownOpen(prev => !prev);
	}, []);

	return (
		<>
			{selectedUser ? (
				<div className="md:min-w-[550px] flex flex-col">
					{/* Header Section */}
					<div className="flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
						<div className={`avatar ${isOnline ? 'online' : ''}`}>
							<div className="w-12 rounded-full">
								<img src={selectedUser?.profilePhoto} alt="user-profile" />
							</div>
						</div>
						<div className="flex flex-col flex-1">
							<div className="flex justify-between gap-2">
								<p>{selectedUser?.fullName}</p>
								{/* Call and Video Call Icons */}
								<div className="flex space-x-4 ">
									<button onClick={openCallModal} className="text-green-400">
										<FaPhoneAlt size={16} />
									</button>
									<button onClick={openVideoCallModal} className="text-blue-500">
										<FaVideo size={21} />
									</button>
									<button onClick={toggleDropdown} className="text-white ">
										<FaEllipsisV size={18} />
									</button>
									{/* Three Dot Menu */}
									<div className="relative ">
										{/* Dropdown Menu */}
										{isDropdownOpen && (
											<div ref={dropdownRef} className="absolute right-0 top-full mt-2 bg-[#E4E4E7] text-black rounded-md shadow-lg w-48 z-40">
												<ul>
													{['View contact', 'Search', 'Add to list', 'Media links & docs', 'Mute notifications', 'Wallpaper', 'More'].map((item, index) => (
														<li key={index}>
															<button className="w-full px-4 py-2 text-sm hover:bg-gray-300">{item}</button>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>{isOnline ? 'Online' : lastSeen}</div>
						</div>
					</div>

					{/* Call and Video Call Modals */}
					{isCallModalOpen && (
						<div className="call-modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
							<div className="bg-white p-4 rounded-lg text-center">
								<h3>Calling {selectedUser?.fullName}...</h3>
								<button onClick={closeCallModal} className="mt-4 text-red-500">
									End Call
								</button>
							</div>
						</div>
					)}

					{isVideoCallModalOpen && (
						<div className="video-call-modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
							<div className="bg-white p-4 rounded-lg text-center">
								<h3>Video Calling {selectedUser?.fullName}...</h3>
								<button onClick={closeVideoCallModal} className="mt-4 text-red-500">
									End Video Call
								</button>
							</div>
						</div>
					)}

					{/* Messages and SendInput */}
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
