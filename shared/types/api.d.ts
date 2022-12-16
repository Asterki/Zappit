import { User } from './models';

export interface LoginRequestBody {
	email: string;
	password: string;
	tfaCode: string | undefined;
}

export type LoginResponse =
	| 'invalid-credentials'
	| 'disabled'
	| 'missing-tfa-code'
	| 'invalid-tfa-code'
	| 'invalid-tfa-code'
	| 'invalid-parameters'
	| 'success'
	| 'server-error';

export interface RegisterRequestBody {
	username: string;
	email: string;
	password: string;
	locale: 'en' | 'es' | 'fr' | 'de';
}

type RegisterResponse =
	| 'err-username-or-email-taken'
	| 'success'
	| 'invalid-parameters'
	| 'server-error'
	| User;

export interface CheckUseRequestBody {
	email: string;
	username: string;
}

export interface CheckUseResponse {
	emailInUse: boolean;
	usernameInUse: boolean;
}
