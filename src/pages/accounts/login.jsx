// * Accounts/Login Page
// * Last updated: 12/01/2022

import { useState, useEffect } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { InputGroup, Form, Spinner } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

import Modal from '../../components/elements/modal';
import Particles from '../../components/elements/particles';

import PassswordInputEye from '../../assets/icons/PasswordInputEye';
import Logo from '../../assets/icons/Logo';
import ReturnButton from '../../assets/icons/ReturnButton';

import * as utils from '../../utils';
import styles from '../../assets/styles/accounts/login.module.scss';
import animations from '../../assets/animations/index';

export async function getServerSideProps({ req, res }) {
	const { data } = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/private/pages/accounts/login`,
		headers: {
			'accept-language': req.headers['accept-language'],
		},
	}).catch((error) => {
		let reportCode = utils.errors.generateReport(error);
		return {
			redirect: {
				destination: `/error?code=${reportCode}`,
				permanent: false,
			},
		};
	});

	return { props: { ...data } };
}

export default function LoginPage(props) {
	const [showingPassword, setShowingPassword] = useState(false);
	const [passedCaptcha, setPassedCaptcha] = useState(false);

	const [openTab, setOpenTab] = useState('form');

	const [loginError, setLoginError] = useState({
		message: 'err-wrong-password',
		error: true,
	});

	const closeModal = () => setLoginError({ ...loginError, error: false });
	const switchReCaptchaPassed = (value) => (value == null ? setPassedCaptcha(false) : setPassedCaptcha(true));

	const switchPasswordVisibility = () => setShowingPassword(!showingPassword);
	const goBackHistory = () => window.history.back();

	const openReCaptchaTab = (event) => {
		event.preventDefault();
		setOpenTab('recaptcha');
	};
	const openFormTab = () => {
		setOpenTab('form');
	};

	const sendLoginRequest = async (event) => {
		if (passedCaptcha) {
			document.querySelector('#login-button-spinner').style.display = 'block';
			document.querySelector('#login-button-text').style.display = 'none';

			const response = await axios({
				method: 'post',
				url: `${props.host}/api/private/accounts/login`,
				data: {
					email: document.querySelector('#email-input').value,
					password: document.querySelector('#password-input').value,
				},
			});

			if (response.data.success == true) return (window.location.href = '/');

			document.querySelector('#login-button-spinner').style.display = 'none';
			document.querySelector('#login-button-text').style.display = 'block';

			openFormTab();
			document.querySelector('#password-input').value = '';
			document.querySelector('#email-input').value = '';

			setTimeout(() => {
				$('#form-container').fadeIn(300);
				setLoginError({
					message: response.data.message,
					error: true,
				});
			}, 300);
		}
	};

	useEffect(() => {
		document.querySelector('#login-button-spinner').style.display = 'none';
	}, []);

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
					<ReturnButton onClick={goBackHistory} width='50' height='50' />
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
					<Form action='/api/private/accounts/login' onSubmit={openReCaptchaTab} method='post'>
						<Form.Label htmlFor='email'>{props.lang.email}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.emailPlaceholder}
								aria-label={props.lang.emailPlaceholder}
								type='email'
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
								id='password-input'
								required
							/>
							<InputGroup.Text onClick={switchPasswordVisibility}>
								<PassswordInputEye width='20' height='20' open={showingPassword} />
							</InputGroup.Text>
						</InputGroup>

						<p>
							{props.lang.forgotPassword.split('&')[0]}
							<Link href='/register'>{props.lang.forgotPassword.split('&')[1]}</Link>
						</p>

						<button type='submit'>
							<span>{props.lang.continue}</span>
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
						sitekey='6LdvbwUeAAAAABEZSr_2aLZnI29vMZ1P-5k-1Xm-'
						onChange={switchReCaptchaPassed}
					/>
					<button disabled={!passedCaptcha} onClick={sendLoginRequest}>
						<p id='login-button-text'>{props.lang.login}</p>
						<Spinner id='login-button-spinner' animation='border' variant='light' />
					</button>
				</motion.div>
			</main>

			<Modal open={loginError.error} title='Error' type='error'>
				<p>{props.lang.errors[loginError.message]}</p>
				<button onClick={closeModal}>Continue</button>
			</Modal>
		</div>
	);
}
