import mongoose from 'mongoose';

const connectDB = async () => {
	await mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log('Connected to MongoDB Database..');
		})
		.catch(error => {
			console.log(error);
		});
};
export default connectDB;
