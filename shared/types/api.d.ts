// accounts/login
export interface LoginRequestBody {
	email: string;
	password: string;
	tfaCode: string | undefined;
}

export type LoginResponse =
	| 'success'
	| 'invalid-credentials'
	| 'disabled'
	| 'missing-tfa-code'
	| 'invalid-tfa-code'
	| 'invalid-tfa-code'
	| 'rate-limit';

// accounts/register
export interface RegisterRequestBody {
	username: string;
	email: string;
	password: string;
	locale: 'en' | 'es' | 'fr' | 'de';
}

export type RegisterResponse = 'rate-limit' | 'success';

// accounts/check-use
export interface CheckUseRequestBody {
	email: string;
	username: string;
}

export interface CheckUseResponse {
	emailInUse: boolean;
	usernameInUse: boolean;
}
