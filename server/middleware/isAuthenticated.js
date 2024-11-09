import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
	try {
		// Check for token in cookies
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: 'User not authenticated.' });
		}

		// Verify the token
		const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (!decode) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		// Set the user ID from the decoded token
		req.id = decode.userId; // Make sure userId exists in your token payload
		next(); // Call the next middleware/route handler
	} catch (error) {
		console.error('Authentication error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export default isAuthenticated;
