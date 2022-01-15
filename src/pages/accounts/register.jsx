// * Accounts/Register Page
// * Last updated: 14/01/2022

import { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';

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
		console.log(error);
	});

	return { props: { ...data, host: process.env.HOST } };
}

export default function Register(props) {
	const [openTab, setOpenTab] = useState('username');
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
	let typingTimers = {
		username: undefined,
		email: undefined,
	};

	const [usernameTabState, setUsernameTabState] = useState({
		username: {
			passed: false,
			error: '',
		},
		email: {
			passed: true,
			error: '',
		},
		name: {
			passed: true,
			error: '',
		},
	});
	const usernameTabEvents = {
		username: async (event) => {
			if (event.target.value.length < 3) {
				return setUsernameTabState({
					...usernameTabState,
					username: {
						passed: false,
						error: 'err-username-short',
					},
				});
			}

			if (event.target.value.length > 24) {
				return setUsernameTabState({
					...usernameTabState,
					username: {
						passed: false,
						error: 'err-username-long',
					},
				});
			}

			clearTimeout(typingTimers.username);
			typingTimers.username = setTimeout(async () => {
				const { data } = await axios({
					method: 'post',
					url: `/api/private/checks/accounts/isUsernameTaken`,
					headers: {},
					data: {
						username: event.target.value,
					},
				});

				if (data.result == true) {
					return setUsernameTabState({
						...usernameTabState,
						username: {
							passed: false,
							error: 'err-username-taken',
						},
					});
				}

				return setUsernameTabState({
					...usernameTabState,
					username: {
						passed: true,
						error: '',
					},
				});
			}, 2000);
		},
		email: async (event) => {
			if (!validator.isEmail(event.target.value)) {
				return setUsernameTabState({
					...usernameTabState,
					email: {
						passed: false,
						error: 'err-email-invalid',
					},
				});
			}

			clearTimeout(typingTimers.email);
			typingTimers.email = setTimeout(async () => {
				const { data } = await axios({
					method: 'post',
					url: `/api/private/checks/accounts/isEmailTaken`,
					headers: {},
					data: {
						email: event.target.value,
					},
				});

				if (data.result == true) {
					return setUsernameTabState({
						...usernameTabState,
						email: {
							passed: false,
							error: 'err-email-taken',
						},
					});
				}

				return setUsernameTabState({
					...usernameTabState,
					email: {
						passed: true,
						error: '',
					},
				});
			}, 2000);
		},
	};

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
			let passwordConfirm = document.querySelector('#password-confirm-input').value;
			let passwordStrength = utils.passwords.rate(password);

			if (passwordStrength > 0 && passwordStrength < 30)
				document.querySelector('#password-strength div').style.background = '#ed4245';
			if (passwordStrength > 30 && passwordStrength < 60)
				document.querySelector('#password-strength div').style.background = '#eda01b';
			if (passwordStrength > 60)
				document.querySelector('#password-strength div').style.background = '#3ba55d';

			if (password.length < 8) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-short' },
				});
			}

			if (password.length > 128) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-long' },
				});
			}

			if (passwordStrength < 30) {
				return setPasswordTabState({
					...passwordTabState,
					password: { ...passwordTabState.password, strength: passwordStrength, passed: false, error: 'err-password-weak' },
				});
			}

			setPasswordTabState({
				...passwordTabState,
				password: { ...passwordTabState.password, strength: passwordStrength, passed: true, error: '' },
				passwordConfirm: {
					...passwordTabState.passwordConfirm,
					error: passwordConfirm !== password ? 'err-password-match' : '',
					passed: passwordConfirm === password,
				},
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

	const register = async (e) => {
		e.preventDefault();

		document.querySelector('#register-button-spinner').style.display = 'block';
		document.querySelector('#register-button-text').style.display = 'none';
		document.querySelector('#register-button').disabled = true;
	};

	useEffect(() => {
		if (passwordTabState.password.passed && passwordTabState.passwordConfirm.passed && passwordTabState.captcha.passed) {
			document.querySelector('#register-button').disabled = false;
		} else {
			document.querySelector('#register-button').disabled = true;
		}

		if (usernameTabState.username.passed && usernameTabState.email.passed && usernameTabState.name.passed) {
			document.querySelector('#next-button').disabled = false;
		} else {
			document.querySelector('#next-button').disabled = true;
		}

		document.querySelector('#register-button-spinner').style.display = 'none';
	}, [usernameTabState, passwordTabState]);

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
								onChange={usernameTabEvents.email}
								type='email'
								id='email-input'
								required
							/>
						</InputGroup>

						<Form.Label htmlFor='username'>{props.lang.username}</Form.Label>
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
								onChange={usernameTabEvents.username}
								type='text'
								id='username-input'
								required
							/>
						</InputGroup>

						<button type='submit' id='next-button' disabled={true}>
							{props.lang.next}
						</button>

						<ul className={styles['errors']}>
							<motion.div
								variants={animations.fade(0.3)}
								initial={usernameTabState.email.error == '' ? 'hidden' : 'visible'}
								animate={usernameTabState.email.error == '' ? 'hidden' : 'visible'}
							>
								{props.lang.errors[usernameTabState.email.error]}
							</motion.div>
							<motion.div
								variants={animations.fade(0.3)}
								initial={usernameTabState.username.error == '' ? 'hidden' : 'visible'}
								animate={usernameTabState.username.error == '' ? 'hidden' : 'visible'}
							>
								{props.lang.errors[usernameTabState.username.error]}
							</motion.div>
						</ul>
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

						<ReCAPTCHA
							className={styles['captcha']}
							theme='dark'
							hl={props.lang.lang}
							sitekey='6LdvbwUeAAAAABEZSr_2aLZnI29vMZ1P-5k-1Xm-'
							onChange={registerTabEvents.captcha}
						/>

						<button id='register-button' disabled={false} onClick={register} type='submit'>
							<p id='register-button-text'>{props.lang.title}</p>
							<Spinner id='register-button-spinner' className="text-center" animation='border' variant='light' />
						</button>

						<ul className={styles['errors']}>
							<motion.div
								variants={animations.fade(0.3)}
								initial={passwordTabState.password.error == '' ? 'hidden' : 'visible'}
								animate={passwordTabState.password.error == '' ? 'hidden' : 'visible'}
							>
								{props.lang.errors[passwordTabState.password.error]}
							</motion.div>
							<motion.div
								variants={animations.fade(0.3)}
								initial={passwordTabState.passwordConfirm.error == '' ? 'hidden' : 'visible'}
								animate={passwordTabState.passwordConfirm.error == '' ? 'hidden' : 'visible'}
							>
								{props.lang.errors[passwordTabState.passwordConfirm.error]}
							</motion.div>
						</ul>
					</Form>
				</motion.div>
			</main>
		</div>
	);
}
