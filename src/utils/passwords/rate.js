module.exports = (pass) => {
	let score = 0;
	if (!pass) return score;

	let letters = new Object();
	for (let i = 0; i < pass.length; i++) {
		letters[pass[i]] = (letters[pass[i]] || 0) + 1;
		score += 5.0 / letters[pass[i]];
	}

	let variations = {
		digits: /\d/.test(pass),
		lower: /[a-z]/.test(pass),
		upper: /[A-Z]/.test(pass),
		nonWords: /\W/.test(pass),
	};

	let variationCount = 0;
	for (let check in variations) {
		variationCount += variations[check] == true ? 1 : 0;
	}
	score += (variationCount - 1) * 10;

	return parseInt(score);
};
