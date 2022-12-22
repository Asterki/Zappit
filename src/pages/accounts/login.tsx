import React from 'react';
import axios from 'axios';
import validator from 'validator';

import { motion } from 'framer-motion';
import { Form, Spinner } from 'react-bootstrap';
import Navbar from '../../components/navbar';
import Head from 'next/head';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

import styles from '../../styles/accounts/login.module.scss';

import type { NextPage, GetServerSideProps } from 'next';
import type { LoginRequestBody, LoginResponse } from '../../../shared/types/api';
import type LangPack from '../../../shared/types/lang';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated() as boolean)
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const Login: NextPage = (): JSX.Element => {
	const appState = useSelector((state: RootState) => state.page);
	const lang = appState.pageLang.accounts.login;

	const [tab, setTab] = React.useState('main' as 'main' | 'tfa');
	const [loading, setLoading] = React.useState(false as boolean);

	const [mainError, setMainError] = React.useState(
		'' as keyof typeof LangPack.accounts.login.errors
	);
	const [tfaError, setTfaError] = React.useState('' as keyof typeof LangPack.accounts.login.errors);

	const clickLoginButton = async (event: React.MouseEvent): Promise<void | string> => {
		// Restart errors, show spinning wheel
		event.preventDefault();
		setMainError('');
		setTfaError('');

		setLoading(true);

		try {
			// Get the values
			const emailOrUsername: string = (
				document.querySelector('#email-or-username-input') as HTMLInputElement
			).value;
			const password: string = (document.querySelector('#password-input') as HTMLInputElement).value;
			const tfaCode: string = (document.querySelector('#tfa-code-input') as HTMLInputElement).value;

			if (
				validator.isEmpty(emailOrUsername, { ignore_whitespace: true }) ||
				validator.isEmpty(password, { ignore_whitespace: true })
			) {
				setLoading(false);
				return setMainError('missing-parameters');
			}

			// Send the request
			const response = await axios({
				method: 'post',
				url: `/api/accounts/login`,
				data: {
					email: emailOrUsername,
					password: password,
					tfaCode: tab == 'tfa' ? tfaCode : undefined,
				} as LoginRequestBody,
			});

			switch (response.data as LoginResponse) {
				case 'success':
					window.location.href = '/home';
					break;

				case 'missing-tfa-code':
					setLoading(false);
					setTab('tfa');
					break;

				case 'invalid-tfa-code':
					setLoading(false);
					setTfaError(response.data);
					break;

				default:
					setMainError(response.data);
					setTfaError(response.data);

					setLoading(false);
			}
		} catch (err: any) {
			console.log(err);
			if (err.name == 'AxiosError')
				return (window.location.href = `/error?code=${err.response.status}`);
		}
	};

	return (
		<div className={styles['page']}>
			<Head>
				<title>{lang.pageTitle}</title>
				<meta name='title' content={lang.pageTitle} />
				<meta name='description' content={lang.pageDescription} />
			</Head>

			<Navbar lang={{ topBar: lang.topBar }} />

			<header>
				<h1>
					<a>{lang.title.split('&')[0]}</a>
					{lang.title.split('&')[1]}
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
					initial='hidden'
					animate={tab == 'main' ? 'shown' : 'hidden'}
				>
					<Form.Group controlId='email-or-username-input'>
						<Form.Label>{lang.form.emailOrUsername}</Form.Label>
						<Form.Control type='text' />
					</Form.Group>
					<p className={styles['error']}>{lang.errors[mainError]}</p>

					<Form.Group controlId='password-input'>
						<Form.Label>{lang.form.password}</Form.Label>
						<Form.Control type='password' />
					</Form.Group>

					<p>
						{lang.forgotPassword.split('&')[0]}{' '}
						<a href='/accounts/reset-password'>{lang.forgotPassword.split('&')[1]}</a>
					</p>

					<br />
					<button onClick={clickLoginButton}>
						{loading && <Spinner animation={'border'} size='sm' />}
						{!loading && <div>{lang.form.login}</div>}
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
					initial='hidden'
					animate={tab == 'tfa' ? 'shown' : 'hidden'}
				>
					<p>{lang.tfaForm.title}</p>
					<Form.Group controlId='tfa-code-input'>
						<Form.Label>{lang.tfaForm.tfa}</Form.Label>
						<Form.Control type='password' />
					</Form.Group>

					<p className={styles['error']}>{lang.errors[tfaError]}</p>
					<button onClick={clickLoginButton}>
						{loading && <Spinner animation={'border'} size='sm' />}
						{!loading && <div>{lang.tfaForm.submit}</div>}
					</button>
					<br />
					<br />

					<p className={styles['go-back-button']} onClick={() => setTab('main')}>
						{lang.tfaForm.back}
					</p>
				</motion.div>
			</main>

			<footer>
				<p>
					{lang.register.split('&')[0]} <a href='/register'>{lang.register.split('&')[1]}</a>
				</p>
			</footer>
		</div>
	);
};

export default Login;
