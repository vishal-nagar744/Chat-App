import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import {
	FaImage,
	FaFile,
	FaMicrophone,
	FaPhoneAlt,
	FaPaperclip,
} from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
	const [message, setMessage] = useState('');
	const [image, setImage] = useState(null);
	const [showMediaOptions, setShowMediaOptions] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const dispatch = useDispatch();
	const { selectedUser } = useSelector(store => store.user);
	const { messages } = useSelector(store => store.message);

	const onSubmitHandler = async e => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('message', message);
			if (image) {
				formData.append('image', image);
			}

			const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});

			dispatch(setMessages([...messages, res?.data?.newMessage]));
		} catch (error) {
			console.log(error);
			alert('Failed to send the message. Please try again.');
		}
		setMessage('');
		setImage(null);
		setImagePreview(null);
	};

	const onImageChange = e => {
		const file = e.target.files[0];
		setImage(file);
		setImagePreview(URL.createObjectURL(file)); // Set image preview URL
	};

	const toggleMediaOptions = () => {
		setShowMediaOptions(!showMediaOptions);
	};

	const handleMediaSelection = mediaType => {
		setSelectedMedia(mediaType);
		setShowMediaOptions(false); // Close media options after selecting
	};

	return (
		<div>
			<form onSubmit={onSubmitHandler} className="px-4 my-3">
				<div className="w-full relative">
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						{/* Smaller Paperclip icon */}
						<label htmlFor="imageUpload" className="cursor-pointer relative" onClick={toggleMediaOptions}>
							<FaPaperclip className="text-white w-5 h-5" /> {/* Smaller WhatsApp-like attachment icon */}
						</label>

						{/* Media options dropdown */}
						{showMediaOptions && (
							<div className="absolute left-0 bottom-full mb-2 bg-white shadow-lg rounded-lg w-40 p-2 z-10">
								<button onClick={() => handleMediaSelection('image')} className="flex items-center space-x-2 w-full text-gray-800 hover:bg-gray-100 py-1 px-2">
									<FaImage className="text-green-500" />
									<span>Image</span>
								</button>
								<button onClick={() => handleMediaSelection('audio')} className="flex items-center space-x-2 w-full text-gray-800 hover:bg-gray-100 py-1 px-2">
									<FaMicrophone className="text-blue-500" />
									<span>Audio</span>
								</button>
								<button onClick={() => handleMediaSelection('document')} className="flex items-center space-x-2 w-full text-gray-800 hover:bg-gray-100 py-1 px-2">
									<FaFile className="text-red-500" />
									<span>Document</span>
								</button>
								<button onClick={() => handleMediaSelection('contact')} className="flex items-center space-x-2 w-full text-gray-800 hover:bg-gray-100 py-1 px-2">
									<FaPhoneAlt className="text-yellow-500" />
									<span>Contact</span>
								</button>
							</div>
						)}
					</span>

					<input
						value={message}
						onChange={e => setMessage(e.target.value)}
						type="text"
						placeholder="Send a message..."
						className="border text-sm rounded-lg block w-full pl-10 p-3 border-zinc-500 bg-gray-600 text-white"
					/>

					<button type="submit" className="absolute flex inset-y-0 end-0 items-center pr-4">
						<IoSend />
					</button>
				</div>

				{/* Media options - image selection */}
				{selectedMedia === 'image' && (
					<div className="mt-2">
						<input type="file" accept="image/*" id="imageUpload" onChange={onImageChange} className="hidden" />
						<label htmlFor="imageUpload" className="cursor-pointer">
							{/* Image Selection Button */}
							<div className={`border p-2 rounded-md ${imagePreview ? 'border-green-500' : 'border-gray-400'} bg-gray-700 text-white`}>
								{imagePreview ? (
									<div className="flex flex-col items-center">
										<img
											src={imagePreview}
											alt="Selected Image"
											className="w-14 h-14 object-cover rounded-md mb-2" // Adjusted size for image preview
										/>
										<span className="text-green-500 text-xs">Image selected</span>
									</div>
								) : (
									<span className="text-sm">Click to select an image</span>
								)}
							</div>
						</label>
					</div>
				)}
			</form>
		</div>
	);
};

export default SendInput;
