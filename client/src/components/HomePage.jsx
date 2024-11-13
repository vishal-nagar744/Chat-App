import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
	const { authUser } = useSelector(store => store.user);
	const navigate = useNavigate();
	useEffect(() => {
		if (!authUser) {
			navigate('/login');
		}
	}, []);
	return (
		<div className="relative flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-clip-padding border-white border-2">
			<div
				style={{
					backgroundImage:
						"url('https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2021/09/gradient-blue-pink-abstract-art-wallpaper-preview-e1656162284223.jpg?fit=728%2C410&ssl=1')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					filter: 'blur(10px)',
				}}
				className="absolute inset-0 z-0"
			/>
			<div className="relative z-10 flex w-full h-full">
				<Sidebar />
				<MessageContainer />
			</div>
		</div>
	);
};

export default HomePage;
