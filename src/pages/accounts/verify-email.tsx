import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InputGroup, Form, Spinner } from 'react-bootstrap';

import Modal from '../../components/modal';
import Particles from '../../components/particles';

import Logo from '../../assets/icons/Logo';
import ReturnButton from '../../assets/icons/ReturnButton';

import animations from '../../assets/animations/index';
import styles from '../../assets/styles/accounts/verify-email.module.scss';
import * as utils from '../../utils';

export async function getServerSideProps({ req, res }) {
	if (req.user == undefined)
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};

	return await axios({
		method: 'get',
		url: `${process.env.HOST}/api/private/pages/accounts/login`,
		headers: req.headers,
	})
		.then((response) => {
			return {
				props: {
					user: JSON.parse(JSON.stringify(req.user)),
					lang: response.data.lang,
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

export default function AccountsVerifyEmail(props) {
	const [openTab, setOpenTab] = useState('button');
	const [error, setError] = useState('');

	const sendVerificationEmail = async () => {
		let response = await axios({
			method: 'post',
			url: `/api/private/emails/accounts/email-verification`,
			headers: {},
			data: {
				email: props.user.email.value,
				lang: 'en', // !!! Change later
			},
		});

		if (response.data.success == true) return setOpenTab('success');

		if (response.data.message == 'err-server-error') return (window.location.href = '/support/error?code=500');

		setOpenTab('button');
		return setError(response.data.message);
	};

	const submitCode = async () => {
		if (code.length != 6) return setError('err-code-length');

		let response = await axios({
			method: 'post',
			url: `/api/private/accounts/verify-email`,
			headers: {},
			data: {
				code: code,
			},
		});

		if (response.data.code == 200) return (window.location.href = '/verify-email?success');
		return setError(response.data.message);
	};

	return (
		<div className={styles['page']}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<Modal open={error.length !== 0} type='error'>
				{props.lang.errors[error]}
				<button>{props.lang.continue}</button>
			</Modal>

			<header>
				<Logo color='white' width='50' height='50' />
				<br />
				<h1>{props.lang.title}</h1>
			</header>

			<main>
				<motion.div
					variants={animations.fade(0.3)}
					initial={openTab == 'button' ? 'visible' : 'hidden'}
					animate={openTab == 'button' ? 'visible' : 'hidden'}
				>
					<button onClick={sendVerificationEmail}>Verify My Email</button>
				</motion.div>

				<motion.div
					variants={animations.fade(0.3)}
					initial={openTab == 'input' ? 'visible' : 'hidden'}
					animate={openTab == 'input' ? 'visible' : 'hidden'}
				>
					<h4>We&apos;ve sent an email containing a 6 digit code to {props.user.email.value}</h4>
					<h4>Please insert that code below</h4>
					<br />
					<input id='code-input' type='text' />
					<br />
					<button onClick={submitCode}>Submit</button>
				</motion.div>
			</main>

			<Particles />
		</div>
	);
}
