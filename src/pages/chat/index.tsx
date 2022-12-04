/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import { getLangFile } from '../../utils/pages';

import Navbar from '../../components/navbar';

import { motion } from 'framer-motion';

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
			lang: getLangFile(context.req.headers['accept-language'], 'main', 'home'),
			user: JSON.parse(JSON.stringify(context.req.user)),

			sessionID: context.req.sessionID,

			cdnURI: process.env.CDN_URI,
			chatWebsocketURI: process.env.CHAT_WEBSOCKET_URI,
		},
	};
};

const Chat: NextPage = (props: any): JSX.Element => {
	const [contactList, setContactList] = React.useState([]);
	const [openChat, setOpenChat] = React.useState({} as User);

	const [socket, setSocket] = React.useState(null as any);

	const switchChat = (user: User) => {
		socket.emit('join private chat room2', {
			wtf: {
				yes: {
					wow: "This works"
				}
			}
		});

		setOpenChat(user);
	};

	React.useEffect(() => {
		document.addEventListener('keydown', (event: any) => {
			if (event.key == 'Escape') return setOpenChat({} as User);
		});

		const newSocket = io(props.chatWebsocketURI);
		newSocket.on('connect', () => {
			console.log('Socket connected');
		});

		setSocket(newSocket);

		// newSocket.on('test', (data: any) => {
		// 	console.log(data);
		// });

		// Load contacts
		(async () => {
			const contactsResponse = await axios({
				method: 'post',
				url: `${props.host}/api/users/get-contacts`,
			});

			setContactList(contactsResponse.data);
		})();
	}, []);

	return (
		<div className={styles['page']}>
			<Navbar lang={props.lang} user={props.user} cdnURI={props.cdnURI} />

			{/* Divide the page in two */}
			<div className={styles['main']}>
				<div className={styles['contacts']}>
					<div>
						<input type="text" placeholder="Search or start a new chat" className={styles['contact-search-bar']} />

						{contactList.map((user: User) => {
							return (
								<motion.div
									className={styles['contact']}
									variants={{
										open: {
											backgroundColor: '#2b2b2b',
										},
										closed: {
											backgroundColor: '#1f1f1f',
										},
									}}
									animate={openChat.userID == user.userID ? 'open' : 'closed'}
									transition={{
										duration: 0.1,
									}}
									key={user.userID}
									onClick={() => {
										switchChat(user);
									}}
								>
									<img src={`${props.cdnURI}/avatars/${user.userID}/${user.avatar}.png?q=1`} className={styles['avatar']} alt={`${user.username} avatar`} />

									<div className={styles['contact-information']}>
										<h5>{user.displayName}</h5>
										<span
											title={
												'overflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflow'
											}
											className={styles['message']}
										>
											overflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflowoverflow
										</span>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>

				{openChat.userID !== undefined && (
					<div className={styles['chat']}>
						<div>
							<div className={styles['navbar']}>
								<img
									src={`${props.cdnURI}/avatars/${openChat.userID}/${openChat.avatar}.png?q=50`}
									className={styles['avatar']}
									alt={`${openChat.username} avatar`}
								/>

								<div className={styles['contact-information']}>
									<h5>{openChat.displayName}</h5>
									<h5>@{openChat.username}</h5>
								</div>
							</div>

							<div className={styles['messages']}>
								<ul>
									{/* {chatMessages.map((message: any) => {
										return (
											<li key={Math.random() * 100}>
												{message.author}: {message.content}
											</li>
										);
									})} */}
								</ul>
							</div>

							<div className={styles['message-input']}>
								<input type="text" id="message-input" placeholder="Message..." />
							</div>
						</div>
					</div>
				)}
				{openChat.userID == undefined && (
					<div className={styles['chat']}>
						<h1>No chat open</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chat;
