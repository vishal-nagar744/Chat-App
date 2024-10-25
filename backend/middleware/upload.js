// middlewares/upload.js
import multer from 'multer';
import path from 'path';

// Configure storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/'); // Folder where images will be stored
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
	},
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Not an image! Please upload an image file.'), false);
	}
};

// Multer upload setup
const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
	fileFilter: fileFilter,
});

export default upload;
