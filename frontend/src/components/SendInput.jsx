import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
	const [message, setMessage] = useState('');
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null); // State for image preview
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

			// if (res.data.imageUploaded) {
			// 	alert('Image Sent Successfully!');
			// } else {
			// 	alert('Text Message Sent.');
			// }

			dispatch(setMessages([...messages, res?.data?.newMessage]));
		} catch (error) {
			console.log(error);
			alert('Failed to send the message. Please try again.');
		}
		setMessage('');
		setImage(null);
		setImagePreview(null); // Reset image preview after submission
	};

	const onImageChange = e => {
		const file = e.target.files[0];
		setImage(file);
		setImagePreview(URL.createObjectURL(file)); // Set the image preview
	};

	return (
		<form onSubmit={onSubmitHandler} className="px-4 my-3">
			<div className="w-full relative">
				<span className="absolute inset-y-0 left-0 flex items-center pl-3">
					<input type="file" accept="image/*" style={{ display: 'none' }} id="imageUpload" onChange={onImageChange} />
					<label htmlFor="imageUpload" className="cursor-pointer relative">
						<img src="https://img.icons8.com/?size=100&id=bjHuxcHTNosO&format=png&color=000000" alt="Upload" className="w-5 h-5" />
						{image && (
							<span className="absolute -top-3 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">1</span>
						)}
					</label>
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
			{/* Show image preview if available */}
			{imagePreview && (
				<div className="mt-2">
					<img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md border border-gray-400" />
				</div>
			)}
		</form>
	);
};

export default SendInput;
