module.exports = (duration) => {
	return {
		hidden: {
			opacity: 0,
			display: 'none',
			transition: {
				display: {
					delay: duration,
				},
			},
		},
		visible: {
			opacity: 1,
			display: 'block',
			transition: {
				duration: duration,
				ease: 'easeInOut',
			},
		},
	};
};
