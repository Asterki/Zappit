/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { io } from 'socket.io-client';
import { getLangFile } from '../../../utils/pages';

import Navbar from '../../../components/navbar';

import styles from '../../styles/chat/index.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

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
	const socket = io(props.host);
	socket.on('message', (data: any) => {
		console.log(data);
	});

	React.useEffect(() => {
		socket.on('connect', () => {
			socket.emit('join-private-chat-room', { user: props.user.username, contact: props.contact });
		});
	}, []);

	return (
		<div className={styles['page']}>
			<Navbar lang={props.lang} user={props.user} cdnHost={props.cdnHost} />
			<h1>jekoqiwjewq</h1>
			<br />
			<br />

			<ul>
				<li>jeioqwje</li>
				<li>jeioqwje</li>
				<li>jeioqwje</li>
				<li>jeioqwje</li>
			</ul>

			<input type="text" />
			<button>Send</button>
		</div>
	);
};

export default Chat;
