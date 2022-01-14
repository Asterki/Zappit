// * Accounts/Register Page
// * Last updated: 12/01/2022

import { useEffect, useState } from 'react';
import axios from 'axios';

import Link from 'next/link';
import { Form, InputGroup, Spinner, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Head from 'next/head';
import ReCAPTCHA from 'react-google-recaptcha';

import Modal from '../../components/elements/modal';
import Particles from '../../components/elements/particles';

import PassswordInputEye from '../../assets/icons/PasswordInputEye';
import Logo from '../../assets/icons/Logo';
import ReturnButton from '../../assets/icons/ReturnButton';
import ArrowSpinner from '../../assets/icons/ArrowSpinner';

import * as utils from '../../utils';
import styles from '../../assets/styles/accounts/register.module.scss';
import animations from '../../assets/animations/index';

export async function getServerSideProps({ req, res }) {
	const { data } = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/private/pages/accounts/register`,
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

export default function Register(props) {
	const [openTab, setOpenTab] = useState('password');
	const showTab = (event, tab) => {
		event.preventDefault();
		setOpenTab(tab);
	};

	const [registerError, setRegisterError] = useState({
		message: 'err-wrong-password',
		error: false,
	});

	const usernameAddon = {
		focus() {
			document.querySelector('#username-addon').style.border = '2px solid #8c77fa';
		},
		blur() {
			document.querySelector('#username-addon').style.border = '2px solid #222222';
		},
	};

	const [usernameTabState, setUsernameTabState] = useState({
		username: {
			passed: false,
			error: '',
		},
		email: {
			passed: false,
			error: '',
		},
		name: {
			passed: false,
			error: '',
		},
	});
	const usernameTabEvents = {};

	const [passwordTabState, setPasswordTabState] = useState({
		password: {
			passed: false,
			visible: false,
			strength: 0,
			error: '',
		},
		passwordConfirm: {
			passed: false,
			visible: false,
			error: '',
		},
		captcha: {
			passed: false,
			error: '',
		},
	});
	const registerTabEvents = {
		captcha(value) {
			if (value == null) return setPasswordTabState({ ...passwordTabState, passed: false, error: '' });
			setPasswordTabState({ ...passwordTabState, captcha: { passed: true, error: '' } });
		},
		passwordAddon() {
			setPasswordTabState({
				...passwordTabState,
				password: { ...passwordTabState.password, visible: !passwordTabState.password.visible },
			});
		},
		passwordConfirmAddon() {
			setPasswordTabState({
				...passwordTabState,
				passwordConfirm: { ...passwordTabState.passwordConfirm, visible: !passwordTabState.passwordConfirm.visible },
			});
		},
		password(event) {
			let password = event.target.value;
			let passwordStrength = utils.passwords.rate(password);

			if (passwordStrength > 0 && passwordStrength < 30)
				document.querySelector('#password-strength div').style.background = '#ed4245';
			if (passwordStrength > 30 && passwordStrength < 60)
				document.querySelector('#password-strength div').style.background = '#eda01b';
			if (passwordStrength > 60 && passwordStrength < 100)
				document.querySelector('#password-strength div').style.background = '#3ba55d';

			if (passwordStrength < 60) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-weak' },
				});
			}

			if (password.length < 8) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-short' },
				});
			}

			if (password.length > 124) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-long' },
				});
			}

			setPasswordTabState({
				...passwordTabState,
				password: { ...passwordTabState.password, strength: passwordStrength, passed: true, error: '' },
			});
		},
		passwordConfirm(event) {
			let password = document.querySelector('#password-input').value;

			if (password !== event.target.value)
				return setPasswordTabState({
					...passwordTabState,
					passwordConfirm: { ...passwordTabState.passwordConfirm, passed: false, error: 'err-password-match' },
				});

			setPasswordTabState({
				...passwordTabState,
				passwordConfirm: { ...passwordTabState.passwordConfirm, passed: true, error: '' },
			});
		},
	};

	useEffect(() => {
		if (passwordTabState.password.passed && passwordTabState.passwordConfirm.passed && passwordTabState.captcha.passed)
			document.querySelector('#register-button').disabled = false;
		else document.querySelector('#register-button').disabled = true;
	}, [usernameTabState, passwordTabState]);

	return (
		<div className={styles.page}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<div className={styles.particles}>{/* <Particles /> */}</div>

			<main>
				<div className={styles['return-button']}>
					<ReturnButton onClick={(e) => window.history.back()} width='50' height='50' />
				</div>

				<div className={styles['title']}>
					<Logo color='white' width='50' height='50' />
					<br />
					<h1>{props.lang.title}</h1>
				</div>

				<motion.div
					variants={animations.fade(0.3)}
					initial={openTab == 'username' ? 'visible' : 'hidden'}
					animate={openTab == 'username' ? 'visible' : 'hidden'}
				>
					<Form onSubmit={(e) => showTab(e, 'password')}>
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

						<Form.Label htmlFor='password'>{props.lang.username}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<InputGroup.Text id='username-addon' className='text-muted'>
								@
							</InputGroup.Text>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.usernamePlaceholder}
								aria-label={props.lang.usernamePlaceholder}
								onFocus={usernameAddon.focus}
								onBlur={usernameAddon.blur}
								type='text'
								id='username-input'
								required
							/>
						</InputGroup>

						<button type='submit'>{props.lang.next}</button>
					</Form>
				</motion.div>

				<motion.div
					variants={animations.fade(0.3)}
					initial={openTab == 'password' ? 'visible' : 'hidden'}
					animate={openTab == 'password' ? 'visible' : 'hidden'}
				>
					<Form onSubmit={(e) => showTab(e, 'confirm-password')}>
						<Form.Label htmlFor='password'>{props.lang.password}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.passwordPlaceholder}
								aria-label={props.lang.passwordPlaceholder}
								type={passwordTabState.password.visible ? 'text' : 'password'}
								id='password-input'
								onChange={registerTabEvents.password}
								required
							/>
							<InputGroup.Text onClick={registerTabEvents.passwordAddon}>
								<PassswordInputEye width='20' height='20' open={passwordTabState.password.visible} />
							</InputGroup.Text>
						</InputGroup>

						<ProgressBar
							id='password-strength'
							className={styles['password-strength']}
							now={passwordTabState.password.strength}
						/>
						<div className={styles["error-label"]}>placeholder</div>

						<Form.Label htmlFor='password'>{props.lang.passwordConfirm}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.passwordConfirmPlaceholder}
								aria-label={props.lang.passwordConfirmPlaceholder}
								type={passwordTabState.passwordConfirm.visible ? 'text' : 'password'}
								id='password-confirm-input'
								onChange={registerTabEvents.passwordConfirm}
								required
							/>
							<InputGroup.Text onClick={registerTabEvents.passwordConfirmAddon}>
								<PassswordInputEye width='20' height='20' open={passwordTabState.passwordConfirm.visible} />
							</InputGroup.Text>
						</InputGroup>

						<div className={styles["error-label"]}>placeholder</div>

						<ReCAPTCHA
							className={styles['captcha']}
							theme='dark'
							hl={props.lang.lang}
							sitekey='6LdvbwUeAAAAABEZSr_2aLZnI29vMZ1P-5k-1Xm-'
							onChange={registerTabEvents.captcha}
						/>

						<button id='register-button' disabled={true} type='submit'>
							{props.lang.title}
						</button>
					</Form>
				</motion.div>
			</main>
		</div>
	);
}
