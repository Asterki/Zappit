/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';
import validator from 'validator';
import { getLangFile } from '../../utils/pages';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';

import { Form, Spinner, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';

import styles from '../../styles/accounts/register.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.user !== undefined)
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return {
		props: {
			host: process.env.HOST,
			lang: getLangFile(context.req.headers['accept-language'], 'accounts', 'register'),
		},
	};
};

const Register: NextPage = (props: any) => {
	const [tab, setTab] = React.useState('email');
	const [loading, setLoading] = React.useState(false);

	const [passwordStrength, setPasswordStrength] = React.useState(0);
	const [passwordStrengthVariant, setPasswordStrengthVariant] = React.useState('danger');

	const [emailError, setEmailError] = React.useState('');
	const [passwordError, setPasswordError] = React.useState('');

	const particlesInit = React.useCallback(async (engine: any) => {
		await loadFull(engine);
	}, []);

	const checkValues = async (event: React.MouseEvent) => {
		event.preventDefault();
		setLoading(true);
		setEmailError('');

		// Get the input values
		const username = (document.querySelector('#username-input') as HTMLInputElement).value;
		const email = (document.querySelector('#email-input') as HTMLInputElement).value;

		// Checks
		if (validator.isEmpty(username) || validator.isEmpty(email)) {
			setEmailError('missing-parameters');
			return setLoading(false);
		}

		if (!validator.isEmail(email)) {
			setEmailError('invalid-email');
			return setLoading(false);
		}

		if (username.length > 16 || username.length < 4) {
			setEmailError('invalid-username-length');
			return setLoading(false);
		}

		if (!validator.isAlpha(username, 'en-GB', { ignore: '.' })) {
			setEmailError('invalid-username');
			return setLoading(false);
		}

		try {
			// Check if the input values are in use
			const response = await axios({
				method: 'post',
				url: `${props.host}/api/accounts/check-use`,
				data: {
					email: email,
					username: username,
				},
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
			if (err.name == 'AxiosError') return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	const register = async (event: React.MouseEvent) => {
		event.preventDefault();

		setLoading(true);
		setPasswordError('');

		// Not tested again, because they were already tested in the last tab
		const username = (document.querySelector('#username-input') as HTMLInputElement).value;
		const email = (document.querySelector('#email-input') as HTMLInputElement).value;

		const password = (document.querySelector('#password-input') as HTMLInputElement).value;
		const confirmPassword = (document.querySelector('#confirm-password-input') as HTMLInputElement).value;

		if (validator.isEmpty(password) || validator.isEmpty(confirmPassword)) {
			setPasswordError('missing-parameters');
			return setLoading(false);
		}

		if (password !== confirmPassword) {
			setPasswordError('mismatching-passwords');
			return setLoading(false);
		}

		if (password.length < 6 || password.length > 256) {
			setPasswordError('invalid-password-length');
			return setLoading(false);
		}

		if (passwordStrengthVariant == 'danger') {
			setPasswordError('password-strength');
			return setLoading(false);
		}

		try {
			const response = await axios({
				method: 'post',
				url: `${props.host}/api/accounts/register`,
				data: {
					username: username,
					email: email,
					password: password,
					locale: props.lang.locale,
				},
			});

			if (response.data == 'success') return (location.href = '/home');
			setPasswordError(response.data);
		} catch (err: any) {
			if (err.name == 'AxiosError') return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	const checkPasswordStrength = () => {
		const password = (document.querySelector('#password-input') as HTMLInputElement).value;

		let score = 0;
		if (!password) return score;

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
				<title>{props.lang.pageTitle}</title>
				<meta name="title" content={props.lang.pageTitle} />
				<meta name="description" content={props.lang.pageDescription} />
			</Head>

			<div>
				<Particles
					init={particlesInit}
					options={{
						particles: {
							number: {
								value: 10,
								density: {
									enable: true,
									value_area: 800,
								},
							},
							shape: {
								polygon: {
									nb_sides: 5,
								},

								type: 'circle',
							},
							line_linked: {
								enable: false,
							},
							opacity: {
								value: 0.3,
							},
							size: {
								value: 3,
								random: true,
								anim: {
									enable: false,
									speed: 20,
									size_min: 0.3,
									sync: false,
								},
							},
							move: {
								direction: 'none',
								enable: true,
								outMode: 'bounce',
								random: false,
								speed: 0.3,
								straight: false,
							},
						},
					}}
				/>
			</div>

			<div className={styles['top-bar']}>
				<img src="/assets/svg/logo.svg" alt="Zappit Logo" />
				<h2>{props.lang.topBar}</h2>
			</div>

			<header>
				<h1>
					<a>{props.lang.title.split('&')[0]}</a>
					{props.lang.title.split('&')[1]}
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
					initial="hidden"
					animate={tab == 'email' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId="username-input">
						<Form.Label>{props.lang.emailForm.username}</Form.Label>
						<Form.Control type="text" />
						<Form.Text className="text-muted">{props.lang.emailForm.usernameDescription}</Form.Text>
					</Form.Group>
					<p className={styles['error']}>{props.lang.errors[emailError]}</p>

					<Form.Group controlId="email-input">
						<Form.Label>{props.lang.emailForm.email}</Form.Label>
						<Form.Control type="email" />
					</Form.Group>
					<p className={styles['login']}>
						{props.lang.register.split('&')[0]} <a href="/login">{props.lang.register.split('&')[1]}</a>
					</p>
					<br />

					<button onClick={checkValues}>
						{loading && <Spinner animation={'border'} size="sm" />}
						{!loading && <div>{props.lang.emailForm.next}</div>}
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
					initial="hidden"
					animate={tab == 'password' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId="password-input">
						<Form.Label>{props.lang.passwordForm.password}</Form.Label>
						<Form.Control type="password" onKeyUp={checkPasswordStrength} />
						<ProgressBar className={styles['progress-bar']} now={passwordStrength} variant={passwordStrengthVariant} />
						<Form.Text className="text-muted">{props.lang.passwordForm.passwordDescription}</Form.Text>
					</Form.Group>
					<p className={styles['error']}>{props.lang.errors[passwordError]}</p>

					<Form.Group controlId="confirm-password-input">
						<Form.Label>{props.lang.passwordForm.confirmPassword}</Form.Label>
						<Form.Control type="password" />
					</Form.Group>
					<br />

					<button onClick={register}>
						{loading && <Spinner animation={'border'} size="sm" />}
						{!loading && <div>{props.lang.passwordForm.register}</div>}
					</button>
				</motion.div>
			</main>

			<footer>
				<p>
					{props.lang.footer.split('&')[0]} <a href="/tos">{props.lang.footer.split('&')[1]}</a> {props.lang.footer.split('&')[2]}{' '}
					<a href="/privacy">{props.lang.footer.split('&')[3]}</a>{' '}
				</p>
			</footer>
		</div>
	);
};

export default Register;
