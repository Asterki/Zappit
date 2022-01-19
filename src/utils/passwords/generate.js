module.exports = (length) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
};
