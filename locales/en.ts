const en = {
	accounts: {
		login: {
			pageTitle: 'Zappit | Login',
			pageDescription: 'Log in to your Zappit account.',

			topBar: 'Zappit',
			title: 'Log In & To Zappit',

			form: {
				emailOrUsername: 'Email Or Username',
				password: 'Password',
				login: 'Login',
				register: "Don't have an account yet? & Register",
			},

			tfaForm: {
				title: 'Please enter the two factor authentication code provided by your app',
				tfa: 'Two Factor Authentication Code',
				submit: 'Submit',
				back: 'Go Back',
			},

			register: "Don't have an account yet? & Register",
			forgotPassword: 'Forgot your password? & Reset it now',

			errors: {
				'invalid-credentials': 'Incorrect username or password',
				'missing-parameters': 'Please fill all spaces',
				'rate-limit': 'You have tried logging in too many times, please try again later',
				'invalid-tfa-code': 'Invalid two factor authentication code',
				'disabled': "This account has been disabled for violations of our TOS"
			},
		},
		register: {
			pageTitle: 'Zappit | Register',
			pageDescription: 'Register a new Zappit account.',
			locale: 'en',

			topBar: 'Zappit',
			title: 'Create & an account',

			register: 'Already have an account? & Login',
			footer: 'By creating an account you agree to our & TOS & and our & Privacy Policy',

			emailForm: {
				username: 'Username',
				usernameDescription: 'Must between 3 and 16 characters long',
				email: 'Email',
				next: 'Next',
			},

			passwordForm: {
				password: 'Password',
				passwordDescription: 'Must be between 6 and 256 characters',
				confirmPassword: 'Confirm Password',
				register: 'Register',
			},

			errors: {
				'missing-parameters': 'Please fill all spaces',
				'mismatching-passwords': "The passwords don't match",

				'invalid-email': 'Invalid email',
				'invalid-username': 'Usernames can only contain letters, bottom dashes (_) and dots (.)',

				'invalid-username-length': 'Your username must be between 4 and 16 characters',
				'invalid-password-length': "The password can't be shorter than 6 characters or longer than 256 characters",

				'email-in-use': 'The email you entered is already in use',
				'username-in-use': 'The username you entered is already in use',
				'err-username-or-email-taken': 'Email or username already taken',

				'rate-limit': "You've already created an account recently, please try again later",
				'password-strength': 'Your password is too weak',
			},
		},
	},
	main: {
		home: {
			title: 'This is the home page',

			topBar: 'Zappit',

		},
	},
	profile: {
		index: {
			title: 'This is the profile page',
		},
	},
	settings: {
		index: {
			title: 'This is the settings page',
		},
		privacy: {
			title: 'This is the privacy settings page',
		},
		security: {
			title: 'This is the security settings page',
		},
	},
};

export default en;
