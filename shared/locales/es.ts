import LangPack from 'shared/types/lang';

const es: typeof LangPack = {
	accounts: {
		login: {
			pageTitle: 'Zappit | Ingresar',
			pageDescription: 'Ingresa a tu cuenta de Zappit.',

			topBar: 'Zappit',
			title: 'Ingresa & A Zappit',

			form: {
				emailOrUsername: 'Email O Nombre de Usuario',
				password: 'Contraseña',
				login: 'Ingresar',
				register: 'Todavía no tienes una cuenta? & Regístrate',
			},

			tfaForm: {
				title:
					'Por favor, ingresa el código de autenticación de dos factores proveído por tu aplicación de verificación',
				tfa: 'Código De Autenticación de Dos Factores',
				submit: 'Enviar',
				back: 'Ir Atrás',
			},

			register: 'Todavía no tienes una cuenta? & Regístrate',
			forgotPassword: 'Olvidaste tu contraseña? & Reinicie su contraseña ahora',

			errors: {
				'invalid-credentials': 'Nombre de usuario o contraseña incorrectas',
				'missing-parameters': 'Por favor, llena todos los espacios',
				'missing-tfa-code': 'Por favor, llena todos los espacioss',
				'rate-limit': 'Has intentado ingresar muchas veces, por favor, intenta después',
				'invalid-tfa-code': 'Código de autenticación de dos factores inválido',
				disabled: 'Esta cuenta ha sido deshabilitada por romper nuestros Términos de Uso',
				'': '',
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

				'invalid-username-length': 'Your username must be between 3 and 16 characters',
				'invalid-password-length':
					"The password can't be shorter than 6 characters or longer than 256 characters",

				'email-in-use': 'The email you entered is already in use',
				'username-in-use': 'The username you entered is already in use',
				'err-username-or-email-taken': 'Email or username already taken',

				'rate-limit': "You've already created an account recently, please try again later",
				'password-strength': 'Your password is too weak',
				'': '',
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

export default es;
