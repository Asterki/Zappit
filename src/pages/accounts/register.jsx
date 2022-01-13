// * Accounts/Register Page
// * Last updated: 12/01/2022

import { useEffect, useState } from 'react';
import axios from 'axios';

import Link from 'next/link';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
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
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [showingConfirmPassword, setShowingConfirmPassword] = useState(false);

	const [userPassedCaptcha, setUserPassedCaptcha] = useState(false);
	const [openTab, setOpenTab] = useState('form');

	const [registerError, setRegisterError] = useState({
		message: 'err-wrong-password',
		error: false,
	});

	const goBackHistory = () => window.history.back();
	const openCaptchaTab = (e) => {
		e.preventDefault();
		setOpenTab('captcha');
	};

	const switchPasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

	const usernameAddon = {
		focus() {
			document.querySelector('#username-addon').style.border = '2px solid #8c77fa';
		},
		blur() {
			document.querySelector('#username-addon').style.border = '2px solid #222222';
		},
	};

	useEffect(() => {});

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
					<Form onSubmit={openCaptchaTab}>
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

						<Form.Label htmlFor='password'>{props.lang.password}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.passwordPlaceholder}
								aria-label={props.lang.passwordPlaceholder}
								type={passwordVisibility ? 'text' : 'password'}
								id='password-input'
								required
							/>
							<InputGroup.Text onClick={switchPasswordVisibility}>
								<PassswordInputEye width='20' height='20' open={passwordVisibility} />
							</InputGroup.Text>
						</InputGroup>

						<button>{props.lang.next}</button>
					</Form>
				</motion.div>
			</main>
		</div>
	);
}
