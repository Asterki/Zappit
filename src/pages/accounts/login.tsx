/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';
import { getLangFile } from '../../utils/pages';

import { motion } from 'framer-motion';

import { Form, Spinner } from 'react-bootstrap';
import Navbar from '../../components/navbar';
import Head from 'next/head';

import styles from '../../styles/accounts/login.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated())
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

const Login: NextPage = (props: any): JSX.Element => {
	const [tab, setTab] = React.useState('main');
	const [loading, setLoading] = React.useState(false);

	const [mainError, setMainError] = React.useState('');
	const [tfaError, setTfaError] = React.useState('');

	const loginButton = async (event: React.MouseEvent) => {
		// Restart errors, show spinning wheel
		event.preventDefault();
		setMainError('');
		setTfaError('');

		setLoading(true);

		try {
			// Get the values
			const emailOrUsername = (document.querySelector('#email-or-username-input') as HTMLInputElement).value;
			const password = (document.querySelector('#password-input') as HTMLInputElement).value;
			const tfaCode = (document.querySelector('#tfa-code-input') as HTMLInputElement).value;

			if (!emailOrUsername || !password) {
				setLoading(false);
				return setMainError('missing-parameters');
			}

			// Send the request
			const response = await axios({
				method: 'post',
				url: `${props.host}/api/accounts/login`,
				data: {
					email: emailOrUsername,
					password: password,
					tfaCode: tab == 'tfa' ? tfaCode : undefined,
				},
			});

			// If successful, redirect to main page
			if (response.data == 'success') return (window.location.href = '/home');

			// If it requires TFA
			if (response.data == 'missing-tfa-code') {
				setLoading(false);
				return setTab('tfa');
			}

			// An auth error ocurred, show the error to the user
			if (response.data == 'invalid-tfa-code') {
				setLoading(false);
				return setTfaError(response.data);
			}

			setMainError(response.data);
			setTfaError(response.data);

			setLoading(false);
		} catch (err: any) {
			console.log(err);
			if (err.name == 'AxiosError') return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	return (
		<div className={styles['page']}>
			<Head>
				<title>{props.lang.pageTitle}</title>
				<meta name="title" content={props.lang.pageTitle} />
				<meta name="description" content={props.lang.pageDescription} />
			</Head>

			<Navbar lang={{ topBar: props.lang.topBar }} />

			<header>
				<h1>
					<a>{props.lang.title.split('&')[0]}</a>
					{props.lang.title.split('&')[1]}
				</h1>
			</header>

			<main>
				{/* Normal Form */}
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
					animate={tab == 'main' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId="email-or-username-input">
						<Form.Label>{props.lang.form.emailOrUsername}</Form.Label>
						<Form.Control type="text" />
					</Form.Group>
					<p className={styles['error']}>{props.lang.errors[mainError]}</p>

					<Form.Group controlId="password-input">
						<Form.Label>{props.lang.form.password}</Form.Label>
						<Form.Control type="password" />
					</Form.Group>

					<p>
						{props.lang.forgotPassword.split('&')[0]} <a href="/accounts/reset-password">{props.lang.forgotPassword.split('&')[1]}</a>
					</p>

					<br />
					<button onClick={loginButton}>
						{loading && <Spinner animation={'border'} size="sm" />}
						{!loading && <div>{props.lang.form.login}</div>}
					</button>
				</motion.div>

				{/* Two Factor Authentication Form */}
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
					animate={tab == 'tfa' ? 'shown' : 'hidden'}
				>
					<p>{props.lang.tfaForm.title}</p>
					<Form.Group controlId="tfa-code-input">
						<Form.Label>{props.lang.tfaForm.tfa}</Form.Label>
						<Form.Control type="password" />
					</Form.Group>

					<p className={styles['error']}>{props.lang.errors[tfaError]}</p>
					<button onClick={loginButton}>
						{loading && <Spinner animation={'border'} size="sm" />}
						{!loading && <div>{props.lang.tfaForm.submit}</div>}
					</button>
					<br />
					<br />

					<p className={styles['go-back-button']} onClick={() => setTab('main')}>
						{props.lang.tfaForm.back}
					</p>
				</motion.div>
			</main>

			<footer>
				<p>
					{props.lang.register.split('&')[0]} <a href="/register">{props.lang.register.split('&')[1]}</a>
				</p>
			</footer>
		</div>
	);
};

export default Login;
