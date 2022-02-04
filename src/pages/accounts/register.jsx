// * Accounts/Register Page
// * Last updated: 20/01/2022

import { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';

import Link from 'next/link';
import { Form, InputGroup, Spinner, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Head from 'next/head';
import ReCAPTCHA from 'react-google-recaptcha';
import * as utils from '../../utils';

import Modal from '../../components/modal';
import Particles from '../../components/particles';

import PassswordInputEye from '../../assets/icons/PasswordInputEye';
import Logo from '../../assets/icons/Logo';
import ReturnButton from '../../assets/icons/ReturnButton';

import styles from '../../assets/styles/accounts/register.module.scss';
import animations from '../../assets/animations/index';

export async function getServerSideProps({ req, res }) {
	if (req.user !== undefined)
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return await axios({
		method: 'get',
		url: `${process.env.HOST}/api/private/pages/accounts/register`,
		headers: req.headers,
	})
		.then((response) => {
			return {
				props: {
					...response.data,
				},
			};
		})
		.catch((error) => {
			return {
				redirect: {
					destination: `/support/error?code=${error.response.status}`,
					permanent: false,
				},
			};
		});
}

let typingTimers = {
	username: undefined,
	email: undefined,
};

export default function AccountsRegister(props) {
	const [openTab, setOpenTab] = useState('username');
	const showTab = (event, tab) => {
		event.preventDefault();
		setOpenTab(tab);
	};

	const [registerError, setRegisterError] = useState({
		message: 'err-rate-limit',
		open: false,
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
					url: `/api/private/checks/accounts/is-username-taken`,
					headers: {},
					data: {
						username: event.target.value,
					},
				});

				if (data.code == 500) return (window.location.href = `/support/error?code=500`);
				if (data.code == 400) return (window.location.href = `/support/error?code=400`);
				if (data.code == 429) return clearTimeout(typingTimers.username);

				if (data.message == true) {
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
					url: `/api/private/checks/accounts/is-email-taken`,
					headers: {},
					data: {
						email: event.target.value,
					},
				});

				if (data.code == 500) return (window.location.href = `/support/error?code=500`);
				if (data.code == 400) return (window.location.href = `/support/error?code=400`);
				if (data.code == 429) return clearTimeout(typingTimers.email);

				if (data.message == true) {
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
			value: '',
			error: '',
		},
	});
	const registerTabEvents = {
		captcha(value) {
			if (value == null) return setPasswordTabState({ ...passwordTabState, passed: false, error: '', value: '' });
			setPasswordTabState({ ...passwordTabState, captcha: { passed: true, error: '', value: value } });
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
			if (passwordStrength > 60) document.querySelector('#password-strength div').style.background = '#3ba55d';

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
		if (e.target.disabled == true) return;

		document.querySelector('#register-button-spinner').style.display = 'block';
		document.querySelector('#register-button-text').style.display = 'none';
		document.querySelector('#register-button').disabled = true;

		const result = await axios({
			method: 'post',
			url: `/api/private/accounts/register`,
			headers: {},
			data: {
				username: document.querySelector('#username-input').value,
				email: document.querySelector('#email-input').value,
				password: document.querySelector('#password-input').value,
				captcha: passwordTabState.captcha.value,
			},
		});

		if (result.data.code == 200) return (window.location.href = '/home');
		if (result.data.code !== 429) return (window.location.href = `/support/error?code=${result.data.code}`);

		if (result.data.code == 429) {
			document.querySelector('#register-button-spinner').style.display = 'none';
			document.querySelector('#register-button-text').style.display = 'block';
			document.querySelector('#register-button').disabled = false;

			setOpenTab('username');
			return setRegisterError({
				message: 'err-rate-limit',
				open: true,
			});
		}
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

						<button type='submit' id='next-button'>
							{props.lang.next}
						</button>
						<p className={styles['login']}>
							{props.lang.login.split('&')[0]} <Link href='/login'>{props.lang.login.split('&')[1]}</Link>
						</p>

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
							sitekey='6LfmhCceAAAAAHLL2uBDMNeFP8lT5vk5J0TaJmv8'
							onChange={registerTabEvents.captcha}
						/>

						<button id='register-button' disabled={false} onClick={(e) => register(e)} type='submit'>
							<p id='register-button-text'>{props.lang.register}</p>
							<Spinner id='register-button-spinner' className='text-center' animation='border' variant='light' />
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

				<p className={styles['tos']}>
					{props.lang.tos.split('&')[0]} <Link href='/support/tos'>{props.lang.tos.split('&')[1]}</Link>
					{props.lang.tos.split('&')[2]} <Link href='/support/privacy'>{props.lang.tos.split('&')[3]}</Link>
				</p>
			</main>

			<Modal open={registerError.open} type='error'>
				{props.lang[registerError.message]}
				<button onClick={(e) => setRegisterError({ message: '', open: false })}>Continue</button>
			</Modal>
		</div>
	);
}
