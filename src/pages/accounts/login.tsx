/* eslint-disable @next/next/no-img-element */
import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import { getLangFile } from '../../utils/pages';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import { Form, InputGroup, FloatingLabel, Spinner } from 'react-bootstrap';
import Head from 'next/head';

import styles from '../../styles/accounts/login.module.scss';
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
			lang: getLangFile(context.req.headers['accept-language'], 'accounts', 'login'),
		},
	};
};

const Login: NextPage = (props: any) => {
	const [error, setError] = React.useState('');
	const [tfaError, setTfaError] = React.useState('invalid-tfa-code');

	const particlesInit = React.useCallback(async (engine: any) => {
		await loadFull(engine);
	}, []);

	const loginButton = async (event: React.MouseEvent) => {
		// Restart errors, show spinning wheel
		event.preventDefault();
		setError('');
		setTfaError('');

		$('#main-form-login-spinner').fadeIn(0);
		$('#tfa-form-login-spinner').fadeIn(0);

		$('#main-form-login-text').fadeOut(0);
		$('#tfa-form-login-text').fadeOut(0);

		try {
			// Get the values
			const emailOrUsername = $('#email-or-username').val();
			const password = $('#password').val();
			const tfaCode = $('#tfa-code').val();

			if (!emailOrUsername || !password) return setError('missing-parameters');

			// Send the request
			const response = await axios({
				method: 'post',
				url: `${props.host}/api/accounts/login`,
				data: {
					email: emailOrUsername,
					password: password,
					tfaCode: tfaCode,
				},
			});

			// If successful, redirect to main page
			if (response.data == 'success') return (window.location.href = '/home');

			// If it requires TFA
			if (response.data == 'missing-tfa-code') {
				$('#main-form').fadeOut(300);

				setTimeout(() => {
					$('#tfa-form').fadeIn(300);
				}, 300);
			}

			// An auth error ocurred, show the error to the user
			if (response.data == 'invalid-tfa-code') return setTfaError('invalid-tfa-code');
			setError(response.data);

			$('#main-form-login-spinner').fadeOut(0);
			$('#tfa-form-login-spinner').fadeOut(0);

			$('#main-form-login-text').fadeIn(0);
			$('#tfa-form-login-text').fadeIn(0);
		} catch (err: any) {
			if (err.name == 'AxiosError') return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	React.useEffect(() => {
		$('#main-form-login-spinner').fadeOut(0);
		$('#tfa-form-login-spinner').fadeOut(0);
		$('#tfa-form').fadeOut(0);
	}, []);

	return (
		<div className={styles['page']}>
			<Head>
				<title>{props.lang.pageTitle}</title>
				<meta name="title" content={props.lang.pageTitle} />
				<meta name="description" content={props.lang.pageDescription} />
			</Head>

			<div id="particles">
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
				{/* Normal Form */}
				<Form id="main-form">
					<InputGroup className="custom-input shadow-none">
						<FloatingLabel controlId="email-or-username" label={props.lang.form.emailOrUsername}>
							<Form.Control type="text" placeholder={props.lang.form.emailOrUsername} />
						</FloatingLabel>
					</InputGroup>
					<p className={styles['error']}>{props.lang.errors[error]}</p>
					<InputGroup className="custom-input shadow-none">
						<FloatingLabel controlId="password" label={props.lang.form.password}>
							<Form.Control type="password" placeholder={props.lang.form.password} />
						</FloatingLabel>
					</InputGroup>
					<br />
					<br />
					<button onClick={loginButton}>
						<Spinner animation={'border'} size="sm" id="main-form-login-spinner" />
						<div id="main-form-login-text">{props.lang.form.login}</div>
					</button>
				</Form>

				{/* Two Factor Authentication Form */}
				<Form id="tfa-form">
					<p>{props.lang.tfaForm.title}</p>
					<InputGroup className="custom-input shadow-none">
						<FloatingLabel controlId="tfa-code" label={props.lang.tfaForm.tfa}>
							<Form.Control type="password" placeholder={props.lang.tfaForm.tfa} />
						</FloatingLabel>
					</InputGroup>
					<p className={styles['error']}>{props.lang.errors[tfaError]}</p>
					<br />
					<button onClick={loginButton}>
						<Spinner animation={'border'} size="sm" id="tfa-form-login-spinner" />
						<div id="tfa-form-login-text">{props.lang.tfaForm.submit}</div>
					</button>
				</Form>
			</main>

			<footer>
				<p>
					{props.lang.form.register.split('&')[0]} <a href="/register">{props.lang.form.register.split('&')[1]}</a>
				</p>
			</footer>
		</div>
	);
};

export default Login;
