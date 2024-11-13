import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
	const dispatch = useDispatch();
	const { selectedUser, onlineUsers } = useSelector(store => store.user);
	const isOnline = onlineUsers?.includes(user._id);

	const selectedUserHandler = user => {
		dispatch(setSelectedUser(user));
	};

	return (
		<>
			<div
				onClick={() => selectedUserHandler(user)}
				className={` ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'} 
                flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}
			>
				<div className={`relative avatar ${isOnline ? 'online' : ''}`}>
					<div className="w-12 rounded-full">
						<img src={user?.profilePhoto} alt="user-profile" />
					</div>
					{/* Dummy Green circle centered on the right */}
					<div className="absolute top-1/2 left-[600%] transform -translate-y-1/2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
						<p className="text-center mt-1">2</p>
					</div>
				</div>

				<div className="flex flex-col flex-1">
					<div className="flex justify-between gap-2">
						<p>{user?.fullName}</p>
					</div>
					<div className="text-gray-500 text-sm">Last message here</div>
				</div>
			</div>
			<div className="divider my-0 py-0 h-1"></div>
		</>
	);
};

export default OtherUser;
