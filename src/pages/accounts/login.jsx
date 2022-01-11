import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import $ from 'jquery';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

import * as utils from '../../utils';
import styles from '../../assets/styles/accounts/login.module.scss';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Particles from '../../components/elements/particles';

import Eye from '../../components/icons/eye';
import Logo from '../../components/icons/logo';
import ReturnButton from '../../components/icons/return-button';

export async function getServerSideProps({ req, res }) {
	const response = await axios({
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

	return {
		props: {
			lang: response.data.lang,
			host: process.env.HOST,
		},
	};
}

export default function LoginPage(props) {
	const [showingPassword, setShowingPassword] = useState(false);
	const [passedCaptcha, setPassedCaptcha] = useState(false);
	const [loginError, setLoginError] = useState({
		message: '',
		error: false,
	});

	useEffect(() => {
		$('#login-button-spinner').hide();

		$('#show-password-button').on('click', () => {
			setShowingPassword(!showingPassword);
		});

		$('#return-button').on('click', () => {
			window.location.href = '/';
		});

		$('#login-form').on('submit', (e) => {
			e.preventDefault();
			$('#form-container').fadeOut(300);

			setTimeout(() => {
				$('#captcha-container').fadeIn(300);
			}, 300);
		});

		$('#login-button').on('click', async (e) => {
			e.preventDefault();

			if (passedCaptcha) {
				$('#login-button-spinner').show();
				$('#login-button-text').hide();

				const response = await axios({
					method: 'post',
					url: `${props.host}/api/private/accounts/login`,
					data: {
						email: $('#email-input').val(),
						password: $('#password-input').val(),
					},
				});

				if (response.data.success == true) return (window.location.href = '/');

				$('#login-button-spinner').hide();
				$('#login-button-text').show();

				$('#captcha-container').fadeOut(300);
				setLoginError({
					message: response.data.message,
					error: true,
				});

				$('#password-input #email-input').val('');

				setTimeout(() => {
					$('#form-container').fadeIn(300);
				}, 300);
			}
		});
	});

	return (
		<div className={styles.page}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<div className={styles.particles}>
				<Particles />
			</div>

			<Modal show={loginError.error} animation={true} centered>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, youre reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<button variant='secondary'>Close</button>
					<button variant='primary'>Save Changes</button>
				</Modal.Footer>
			</Modal>

			<main>
				<div className={styles['return-button']}>
					<ReturnButton id='return-button' width='50' height='50' />
				</div>

				<div className={styles['title']}>
					<Logo color='white' width='50' height='50' />
					<br />
					<h1>{props.lang.title}</h1>
				</div>

				<div id='form-container' className={styles['form-container']}>
					<Form action='/api/private/accounts/login' id='login-form' method='post'>
						<Form.Label htmlFor='email'>{props.lang.email}</Form.Label>
						<InputGroup className={`mb-3 ${styles['input-group']}`}>
							<Form.Control
								className='shadow-none text-white'
								placeholder={props.lang.emailPlaceholder}
								aria-label={props.lang.emailPlaceholder}
								type='email'
								name='email'
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
								name='password'
								type={showingPassword ? 'text' : 'password'}
								required
							/>
							<InputGroup.Text id='show-password-button'>
								<Eye width='20' height='20' open={showingPassword} />
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
				</div>

				<div id='captcha-container' className={styles['captcha-container']}>
					<p>{props.lang.captcha}</p>
					<ReCAPTCHA
						theme='dark'
						hl={props.lang.lang}
						sitekey='6LdvbwUeAAAAABEZSr_2aLZnI29vMZ1P-5k-1Xm-'
						onChange={(value) => (value == null ? setPassedCaptcha(false) : setPassedCaptcha(true))}
					/>
					<button id='login-button' disabled={!passedCaptcha}>
						<p id='login-button-text'>{props.lang.login}</p>
						<Spinner id='login-button-spinner' animation='border' variant='light' />
					</button>
				</div>
			</main>
		</div>
	);
}
