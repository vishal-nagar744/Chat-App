import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { FaImage } from 'react-icons/fa'; // Importing image icon
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
	const [message, setMessage] = useState('');
	const [image, setImage] = useState(null); // State to store selected image
	const dispatch = useDispatch();
	const { selectedUser } = useSelector(store => store.user);
	const { messages } = useSelector(store => store.message);

	// Handle image selection
	const onImageChange = e => {
		setImage(e.target.files[0]); // Store selected file
	};

	// Submit handler for both message and image
	const onSubmitHandler = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('message', message);
		if (image) {
			formData.append('image', image); // Append image if selected
		}

		try {
			const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // For sending form data
				},
				withCredentials: true,
			});
			dispatch(setMessages([...messages, res?.data?.newMessage]));
		} catch (error) {
			console.log(error);
		}
		setMessage(''); // Reset message input
		setImage(null); // Reset image input
	};

	return (
		<form onSubmit={onSubmitHandler} className="px-4 my-3">
			<div className="w-full relative flex items-center">
				{/* Input field for message */}
				<input
					value={message}
					onChange={e => setMessage(e.target.value)}
					type="text"
					placeholder="Send a message..."
					className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
				/>

				{/* Image upload button */}
				<label htmlFor="imageUpload" className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer">
					<FaImage className="text-white" /> {/* Image icon */}
				</label>
				<input
					type="file"
					id="imageUpload"
					accept="image/*"
					onChange={onImageChange}
					style={{ display: 'none' }} // Hide the actual file input
				/>

				{/* Send button */}
				<button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
					<IoSend className="text-white" />
				</button>
			</div>
		</form>
	);
};

export default SendInput;
