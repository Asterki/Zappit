// * Accounts/Login Page
// * Last updated: 20/01/2022

import { useState } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { InputGroup, Form, Spinner } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

import Modal from '../../components/modal';
import Particles from '../../components/particles';

import PassswordInputEye from '../../assets/icons/PasswordInputEye';
import Logo from '../../assets/icons/Logo';
import ReturnButton from '../../assets/icons/ReturnButton';

import styles from '../../assets/styles/accounts/login.module.scss';
import animations from '../../assets/animations/index';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.user !== undefined)
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return await axios({
		method: 'get',
		url: `${context.req.protocol + '://' + context.req.headers.host}/api/private/pages/accounts/login`,
		headers: context.req.headers,
	})
		.then((response) => {
			return {
				props: {
					...response.data,
				},
			};
		})
		.catch((error) => {
			console.log(error);
			return {
				redirect: {
					destination: `/support/error?code=${error.response.status}`,
					permanent: false,
				},
			};
		});
};

export default function AccountsLogin(props: any) {
	const [showingPassword, setShowingPassword] = useState(false);
	const [openTab, setOpenTab] = useState('form');

	const [passedCaptcha, setPassedCaptcha] = useState({
		passed: false,
		value: '',
	});
	const [loginError, setLoginError] = useState({
		message: '',
		open: false,
	});
	const [inputStates, setInputStates] = useState({
		email: '',
		password: '',
	});

	const sendLoginRequest = async () => {
		if (passedCaptcha) {
			(document.querySelector('#login-button-spinner') as HTMLInputElement).style.display = 'block';
			(document.querySelector('#login-button-text') as HTMLInputElement).style.display = 'none';

			const response = await axios({
				method: 'post',
				url: `/api/private/accounts/login`,
				data: {
					email: (document.querySelector('#email-input') as HTMLInputElement).value,
					password: (document.querySelector('#password-input') as HTMLInputElement).value,
					recaptcha: passedCaptcha.value,
				},
			});

			console.log(response)

			if (response.data.code == 200) return (window.location.href = '/home');
			if (response.data.code == 500) return (window.location.href = '/support/error?code=500');
			if (response.data.code == 400) return (window.location.href = '/support/error?code=400');

			if (response.data.code == 403 || response.data.code == 429) {
				console.log(response.data);

				(document.querySelector('#login-button-spinner') as HTMLInputElement).style.display = 'none';
				(document.querySelector('#login-button-text') as HTMLInputElement).style.display = 'block';

				setOpenTab('form');
				(document.querySelector('#password-input') as HTMLInputElement).value = '';
				(document.querySelector('#email-input') as HTMLInputElement).value = '';

				setTimeout(() => {
					setOpenTab('form');

					setLoginError({
						message: response.data.message,
						open: true,
					});
				}, 300);
			}
		}
	};

	return (
		<div className={styles.page}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<div className={styles.particles}>
				<Particles />
			</div>

			<main>
				<div className={styles['return-button']}>
					<ReturnButton onClick={() => window.history.back()} width='50' height='50' />
				</div>

				<div className={styles['title']}>
					<Logo color='white' width='50' height='50' />
					<br />
					<h1>{props.lang.title}</h1>
				</div>

				<motion.div
					className={styles['form-container']}
					variants={animations.fade(0.3)}
					initial={openTab == 'form' ? 'visible' : 'hidden'}
					animate={openTab == 'form' ? 'visible' : 'hidden'}
				>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							setOpenTab('recaptcha');
						}}
					>
						<Form.Label htmlFor='email'>{props.lang.email}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.emailPlaceholder}
								aria-label={props.lang.emailPlaceholder}
								type='email'
								onChange={(e) => {
									setInputStates({
										...inputStates,
										email: e.target.value,
									});
								}}
								id='email-input'
								required
							/>
						</InputGroup>
						<p>
							{props.lang.register.split('&')[0]}
							<Link href='/register'>{props.lang.register.split('&')[1]}</Link>
						</p>
						<br />

						<Form.Label htmlFor='password'>{props.lang.password}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.passwordPlaceholder}
								aria-label={props.lang.passwordPlaceholder}
								type={showingPassword ? 'text' : 'password'}
								autoComplete='on'
								id='password-input'
								onChange={(e) => {
									setInputStates({
										...inputStates,
										password: e.target.value,
									});
								}}
								required
							/>
							<InputGroup.Text onClick={() => setShowingPassword(!showingPassword)}>
								<PassswordInputEye width='20' height='20' open={showingPassword} />
							</InputGroup.Text>
						</InputGroup>

						<p>
							{props.lang.forgotPassword.split('&')[0]}
							<Link href='/register'>{props.lang.forgotPassword.split('&')[1]}</Link>
						</p>

						<button disabled={inputStates.email == '' || inputStates.password == ''} type='submit'>
							{props.lang.continue}
						</button>
					</Form>
				</motion.div>

				<motion.div
					variants={animations.fade(0.3)}
					initial={openTab == 'recaptcha' ? 'visible' : 'hidden'}
					animate={openTab == 'recaptcha' ? 'visible' : 'hidden'}
					className={styles['captcha-container']}
				>
					<p>{props.lang.captcha}</p>
					<ReCAPTCHA
						theme='dark'
						hl={props.lang.lang}
						sitekey='6LfmhCceAAAAAHLL2uBDMNeFP8lT5vk5J0TaJmv8'
						onChange={(value: any) => setPassedCaptcha({ value: value, passed: value !== null })}
					/>
					<button disabled={!passedCaptcha.passed} onClick={sendLoginRequest}>
						<p id='login-button-text'>{props.lang.login}</p>
						<Spinner style={{ display: 'none' }} id='login-button-spinner' animation='border' variant='light' />
					</button>
				</motion.div>
			</main>

			<Modal open={loginError.open} title='Error' type='error'>
				<p>{props.lang.errors[loginError.message]}</p>
				<button onClick={() => setLoginError({ message: '', open: false })}>Continue</button>
			</Modal>
		</div>
	);
}
