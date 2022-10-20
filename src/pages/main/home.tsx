/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import axios from 'axios';
import { getLangFile } from '../../utils/pages';

import styles from '../../styles/accounts/login.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.user == undefined)
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};

	return {
		props: {
			host: process.env.HOST,
			lang: getLangFile(context.req.headers['accept-language'], 'main', 'home'),
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

const Home: NextPage = (props: any) => {
	return (
		<div className={styles['page']}>
			<h1>{props.lang.title}</h1>
			<h2>Your username is: {props.user.username}</h2>
			<a href="/profile">Profile</a>
			<a href="/profile/settings">Settings</a>
		</div>
	);
};

export default Home;
