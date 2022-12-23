const en = {
	accounts: {
		login: {
			pageTitle: '',
			pageDescription: '',

			topBar: '',
			title: '&',

			form: {
				emailOrUsername: '',
				password: '',
				login: '',
				register: '',
			},

			tfaForm: {
				title: '',
				tfa: '',
				submit: '',
				back: '',
			},

			register: '&',
			forgotPassword: '&',

			errors: {
				'invalid-credentials': '',
				'missing-parameters': '',
                'missing-tfa-code': '',
				'rate-limit': '',
				'invalid-tfa-code': '',
				disabled: '',
			},
		},
		register: {
			pageTitle: '',
			pageDescription: '',
			locale: '',

			topBar: '',
			title: '&',

			register: '',
			footer: '&&&',

			emailForm: {
				username: '',
				usernameDescription: '',
				email: '',
				next: '',
			},

			passwordForm: {
				password: '',
				passwordDescription: '',
				confirmPassword: '',
				register: '',
			},

			errors: {
				'missing-parameters': '',
				'mismatching-passwords': '',

				'invalid-email': '',
				'invalid-username': '',

				'invalid-username-length': '',
				'invalid-password-length': '',

				'email-in-use': '',
				'username-in-use': '',
				'err-username-or-email-taken': '',

				'rate-limit': '',
				'password-strength': '',
			},
		},
	},
	main: {
		home: {
			title: '',

			topBar: '',
		},
	},
	profile: {
		index: {
			title: '',
		},
	},
	settings: {
		index: {
			title: '',
		},
		privacy: {
			title: '',
		},
		security: {
			title: '',
		},
	},
};

export default en;
