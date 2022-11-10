/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import { getLangFile } from '../../utils/pages';

import Navbar from '../../components/navbar';

import styles from '../../styles/chat/index.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

import type { User } from '../../../types';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};

	return {
		props: {
			host: process.env.HOST,
			cdnHost: process.env.CDN_URI,
			lang: getLangFile(context.req.headers['accept-language'], 'main', 'home'),
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

const Chat: NextPage = (props: any): JSX.Element => {
	const [contactList, setContactList] = React.useState([]);

	const contacts = contactList.map((user: User) => {
		return (
			<div key={user.userID}>
				<img src={`${props.cdnHost}/avatars/${user.userID}/${user.avatar}.png?q=1`} width="40" alt={`${user.username} avatar`} />
				<h1>{user.displayName}</h1>
				<h3>{user.username}</h3>
			</div>
		);
	});

	const b = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/users/get-contacts`,
		});

		setContactList(response.data);

		console.log(response.data);
	};

	return (
		<div className={styles['page']}>
			<Navbar lang={props.lang} user={props.user} cdnHost={props.cdnHost} />
			<div className={styles['main']}>{contacts}</div>
			<br />
			<br />
			<br />
			<br />
			<button onClick={b}>ejhwquioej</button>
		</div>
	);
};

export default Chat;
