// * English translation UTF-8 (last updated: 2022-01-12)

let en = {
	main: {
		index: {
			pageTitle: 'Zappit',
		},
	},
	accounts: {
		login: {
			pageTitle: 'Zappit | Login',
			pageDescription: 'Login to your Zappit account',

			title: 'Login to Zappit',

			email: 'Your Email',
			emailPlaceholder: 'john.doe@example.com',
			register: "Don't have an account? & Register",

			password: 'Your Password',
			passwordPlaceholder: '••••••••••••',
			forgotPassword: 'Forgot your password? & Reset it now',

			login: 'Login',
			continue: 'Continue',
			close: 'Close',
			error: 'Error logging in',

			lang: 'en',
			captcha: 'Please complete the captcha below to continue',

			errors: {
				'err-missing-credentials': 'Please enter your email and password',
				'err-logged-in': 'You are already logged in',
				'err-wrong-credentials': 'Could not find a user with that email and password',
				'err-rate-limit': 'Too many login attempts, please try again later',
			},
		},
		register: {
			pageTitle: 'Zappit | Register',
			pageDescription: 'Register to the world of Zappit',

			title: 'Register',

			email: 'Your Email',
			emailPlaceholder: 'john.doe@example.com',

			username: 'Your Username',
			usernamePlaceholder: 'john.doe',

			password: 'Your Password',
			passwordPlaceholder: '••••••••••••',

			passwordConfirm: 'Confirm Password',
			passwordConfirmPlaceholder: '••••••••••••',

			login: 'Already have an account? & Login',
			next: 'Next',

			errors: {
				'': '',
				'err-username-taken': '• Username is already taken',
				'err-username-short': '• Username is too short',
				'err-username-long': '• Username is too long',
				
				'err-email-taken': '• Email is already taken',
				'err-email-invalid': '• Email is invalid',
				
				'err-password-match': '• Passwords do not match',
				'err-password-short': '• Password must be at least 8 characters long',
				'err-password-long': '• Password must be less than 128 characters long',
				'err-password-weak': '• Password is too weak',
			},
		},
	},
};

module.exports = en;
