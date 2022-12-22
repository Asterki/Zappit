import React from 'react';
import axios from 'axios';
import validator from 'validator';
import { z } from 'zod';

import { motion } from 'framer-motion';
import { Form, Spinner, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import Navbar from '../../components/navbar';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

import styles from '../../styles/accounts/register.module.scss';

import type { NextPage, GetServerSideProps } from 'next';
import type {
	CheckUseRequestBody,
	CheckUseResponse,
	RegisterRequestBody,
} from '../../../shared/types/api';
import type LangPack from '../../../shared/types/lang';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated())
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const Register: NextPage = (): JSX.Element => {
    const appState = useSelector((state: RootState) => state.page);
	const lang = appState.pageLang.accounts.register;

	const [tab, setTab] = React.useState('email' as 'email' | 'password');
	const [loading, setLoading] = React.useState(false as boolean);

	const [passwordStrength, setPasswordStrength] = React.useState(0 as number);
	const [passwordStrengthVariant, setPasswordStrengthVariant] = React.useState(
		'danger' as 'success' | 'warning' | 'danger'
	);

	const [emailError, setEmailError] = React.useState(
		'' as keyof typeof LangPack.accounts.register.errors
	);
	const [passwordError, setPasswordError] = React.useState(
		'' as keyof typeof LangPack.accounts.register.errors
	);

	const checkValues = async (event: React.MouseEvent): Promise<void | string> => {
		event.preventDefault();
		setLoading(true);
		setEmailError('');

		// Get the input values
		const username = (document.querySelector('#username-input') as HTMLInputElement).value;
		const email = (document.querySelector('#email-input') as HTMLInputElement).value;

		// Checks
		const parsedData = z
			.object({
				username: z
					.string()
					.min(3, {
						message: 'invalid-username-length',
					})
					.max(16, {
						message: 'invalid-username-length',
					})
					.refine(
						(username) => {
							return validator.isAlphanumeric(username, 'en-GB', { ignore: '._' });
						},
						{
							message: 'invalid-username',
						}
					),
				email: z.string().refine(validator.isEmail, {
					message: 'invalid-email',
				}),
			})
			.required()
			.safeParse({ username: username, email: email });

		if (!parsedData.success && parsedData.error) {
			setEmailError(
				parsedData.error.errors[0].message as keyof typeof LangPack.accounts.register.errors
			);
			return setLoading(false);
		}

		try {
			// Check if the input values are in use
			const response: { data: CheckUseResponse } = await axios({
				method: 'post',
				url: `${appState.hostURL}/api/accounts/check-use`,
				data: {
					email: email,
					username: username,
				} as CheckUseRequestBody,
			});

			// Set an error if so
			if (response.data.emailInUse || response.data.usernameInUse) {
				setEmailError(response.data.emailInUse ? 'email-in-use' : 'username-in-use');
				return setLoading(false);
			}

			// If not, change to the password tab
			setTab('password');
			return setLoading(false);
		} catch (err: any) {
			if (err.name == 'AxiosError')
				return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	const register = async (event: React.MouseEvent): Promise<void | string> => {
		event.preventDefault();

		setLoading(true);
		setPasswordError('');

		const username = (document.querySelector('#username-input') as HTMLInputElement).value;
		const email = (document.querySelector('#email-input') as HTMLInputElement).value;

		const password = (document.querySelector('#password-input') as HTMLInputElement).value;
		const confirmPassword = (document.querySelector('#confirm-password-input') as HTMLInputElement)
			.value;

		const parsedData = z
			.object({
				username: z
					.string()
					.min(3, {
						message: 'invalid-username-length',
					})
					.max(16, {
						message: 'invalid-username-length',
					})
					.refine(
						(username) => {
							return validator.isAlphanumeric(username, 'en-GB', { ignore: '._' });
						},
						{
							message: 'invalid-username',
						}
					),
				email: z.string().refine(validator.isEmail, {
					message: 'invalid-email',
				}),
				password: z
					.string()
					.max(256, {
						message: 'invalid-password-length',
					})
					.min(6, {
						message: 'invalid-password-length',
					}),
				confirmPassword: z
					.string()
					.max(256, {
						message: 'invalid-password-length',
					})
					.min(6, {
						message: 'invalid-password-length',
					}),
			})
			.required()
			.safeParse({
				username: username,
				email: email,

				password: password,
				confirmPassword: confirmPassword,
			});

		if (!parsedData.success && parsedData.error) {
			setEmailError(
				parsedData.error.errors[0].message as keyof typeof LangPack.accounts.register.errors
			);
			return setLoading(false);
		}

		if (password !== confirmPassword) {
			setPasswordError('mismatching-passwords');
			return setLoading(false);
		}

		if (passwordStrengthVariant == 'danger') {
			setPasswordError('password-strength');
			return setLoading(false);
		}

		try {
			const response = await axios({
				method: 'post',
				url: `${appState.hostURL}/api/accounts/register`,
				data: {
					username: username,
					email: email,
					password: password,
					locale: lang.locale,
				} as RegisterRequestBody,
			});

			if (response.data == 'success') return (location.href = '/home');
			setPasswordError(response.data);
		} catch (err: any) {
			if (err.name == 'AxiosError')
				return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	const checkPasswordStrength = (): void => {
		const password = (document.querySelector('#password-input') as HTMLInputElement).value;

		let score = 0;
		if (!password) return setPasswordStrengthVariant('danger');

		const letters: any = new Object();
		for (let i = 0; i < password.length; i++) {
			letters[password[i]] = (letters[password[i]] || 0) + 1;
			score += 5.0 / letters[password[i]];
		}

		// bonus points for mixing it up
		const variations: any = {
			digits: /\d/.test(password),
			lower: /[a-z]/.test(password),
			upper: /[A-Z]/.test(password),
			nonWords: /\W/.test(password),
		};

		let variationCount = 0;
		for (const check in variations) {
			variationCount += variations[check] == true ? 1 : 0;
		}
		score += (variationCount - 1) * 10;

		setPasswordStrength(score);

		if (score > 60) return setPasswordStrengthVariant('success');
		if (score > 40) return setPasswordStrengthVariant('warning');
		if (score >= 20) return setPasswordStrengthVariant('danger');
		setPasswordStrengthVariant('danger');
	};

	return (
		<div className={styles['page']}>
			<Head>
				<title>{lang.pageTitle}</title>
				<meta name='title' content={lang.pageTitle} />
				<meta name='description' content={lang.pageDescription} />
			</Head>

			<Navbar lang={{ topBar: lang.topBar }} />

			<header>
				<h1>
					<a>{lang.title.split('&')[0]}</a>
					{lang.title.split('&')[1]}
				</h1>
			</header>

			<main>
				{/* Email and username form */}
				<motion.div
					variants={{
						shown: {
							opacity: 1,
							display: 'block',
							transition: {
								duration: 0.3,
								delay: 0.3,
							},
						},
						hidden: {
							opacity: 0,
							transition: {
								duration: 0.3,
							},
							transitionEnd: {
								display: 'none',
							},
						},
					}}
					initial='hidden'
					animate={tab == 'email' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId='username-input'>
						<Form.Label>{lang.emailForm.username}</Form.Label>
						<Form.Control type='text' />
						<Form.Text className='text-muted'>{lang.emailForm.usernameDescription}</Form.Text>
					</Form.Group>
					<p className={styles['error']}>{lang.errors[emailError]}</p>

					<Form.Group controlId='email-input'>
						<Form.Label>{lang.emailForm.email}</Form.Label>
						<Form.Control type='email' />
					</Form.Group>
					<p className={styles['login']}>
						{lang.register.split('&')[0]} <a href='/login'>{lang.register.split('&')[1]}</a>
					</p>
					<br />

					<button onClick={checkValues}>
						{loading && <Spinner animation={'border'} size='sm' />}
						{!loading && <div>{lang.emailForm.next}</div>}
					</button>
				</motion.div>

				{/* Password form */}
				<motion.div
					variants={{
						shown: {
							opacity: 1,
							display: 'block',
							transition: {
								duration: 0.3,
								delay: 0.3,
							},
						},
						hidden: {
							opacity: 0,
							transition: {
								duration: 0.3,
							},
							transitionEnd: {
								display: 'none',
							},
						},
					}}
					initial='hidden'
					animate={tab == 'password' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId='password-input'>
						<Form.Label>{lang.passwordForm.password}</Form.Label>
						<Form.Control type='password' onKeyUp={checkPasswordStrength} />
						<ProgressBar
							className={styles['progress-bar']}
							now={passwordStrength}
							variant={passwordStrengthVariant}
						/>
						<Form.Text className='text-muted'>{lang.passwordForm.passwordDescription}</Form.Text>
					</Form.Group>
					<p className={styles['error']}>{lang.errors[passwordError]}</p>

					<Form.Group controlId='confirm-password-input'>
						<Form.Label>{lang.passwordForm.confirmPassword}</Form.Label>
						<Form.Control type='password' />
					</Form.Group>
					<br />

					<button onClick={register}>
						{loading && <Spinner animation={'border'} size='sm' />}
						{!loading && <div>{lang.passwordForm.register}</div>}
					</button>
				</motion.div>
			</main>

			<footer>
				<p>
					{lang.footer.split('&')[0]} <a href='/tos'>{lang.footer.split('&')[1]}</a>{' '}
					{lang.footer.split('&')[2]} <a href='/privacy'>{lang.footer.split('&')[3]}</a>
				</p>
			</footer>
		</div>
	);
};

export default Register;
