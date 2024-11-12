// Function jo date header show karega
const getDateHeader = (timestamp, previousMessage) => {
	const date = new Date(timestamp); // Message ki date ko Date object mein convert karte hain
	const now = new Date(); // Aaj ki date
	const yesterday = new Date();
	yesterday.setDate(now.getDate() - 1); // Kal ki date

	// Agar message aaj ka hai
	if (date.toDateString() === now.toDateString()) {
		return 'Today'; // "Today" show karenge
	}
	// Agar message kal ka hai
	else if (date.toDateString() === yesterday.toDateString()) {
		return 'Yesterday'; // "Yesterday" show karenge
	}
	// Agar message purane din ka hai
	else {
		// Specific date format mein date ko show karenge
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return new Intl.DateTimeFormat('en-US', options).format(date);
	}
};

// Messages ko simulate karne ke liye
const mockMessages = [
	{
		senderId: 'user1',
		createdAt: new Date('2024-11-12T10:00:00').toISOString(),
		message: 'Hello, this is a test message!',
	},
	{
		senderId: 'user2',
		createdAt: new Date('2024-11-12T14:00:00').toISOString(),
		message: 'Another message on the same day!',
	},
	{
		senderId: 'user1',
		createdAt: new Date('2024-11-13T09:00:00').toISOString(),
		message: 'Hello again, new day!',
	},
	{
		senderId: 'user2',
		createdAt: new Date('2024-11-13T10:00:00').toISOString(),
		message: 'Message on the second day.',
	},
];

// Har message ke liye date header dikhana ya skip karna
let lastDate = null; // Pehle message ki date ko store karenge

mockMessages.forEach((msg, index) => {
	// Pehle message ka data (pichle message ke liye null hai)
	const previousMessage = mockMessages[index - 1] || null;

	// Current message ka date header nikaal rahe hain
	const currentDateHeader = getDateHeader(msg.createdAt, previousMessage);

	// Agar previous message ki date aur current message ki date alag hai, tab date header show karenge
	if (lastDate !== currentDateHeader) {
		console.log(`Rendering Message ${index + 1}:`);
		console.log(`Date Header: ${currentDateHeader}`);
		lastDate = currentDateHeader; // Ab lastDate ko update karenge
	} else {
		console.log(`Rendering Message ${index + 1}:`);
		console.log(`Date Header: (No new date header)`); // Same din ke liye date header show nahi karenge
	}
});
