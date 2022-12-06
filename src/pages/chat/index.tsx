/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import validator from 'validator';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { getLangFile } from '../../utils/pages';

import Navbar from '../../components/navbar';
import { motion } from 'framer-motion';

import styles from '../../styles/chat/index.module.scss';
import type { NextPage, GetServerSideProps } from 'next';
import type { PrivateMessage, SocketIOPayload, User } from '../../../types';

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

	const [chatMessages, setChatMessages] = React.useState([] as Array<PrivateMessage>);

	const [socket, setSocket] = React.useState(null as unknown as Socket);

	const switchChat = (user: User) => {
		if (!socket || !socket.connected) return;

		socket.emit('join private chat room', {
			auth: {
				username: props.user.username,
				sessionID: props.sessionID,
			},
			data: {
				userID: props.user.userID,
				connectToID: user.userID,
			},
		} as SocketIOPayload);

		setOpenChat(user);
		setChatMessages([]);
	};

	const sendMessage = () => {
		if (!socket || !socket.connected) return;
		const messageInput = document.querySelector('#message-input') as HTMLTextAreaElement;
		if (validator.isEmpty(messageInput.value, { ignore_whitespace: true })) return;

		messageInput.style.height = '50px';

		socket.emit('private message', {
			auth: {
				username: props.user.username,
				sessionID: props.sessionID,
			},
			data: {
				author: props.user.username,

				userID: props.user.userID,
				sendToID: openChat.userID,

				messageID: uuidv4().split('-').join('').substring(0, 16),

				// attachments
				// embeds
				// mentions
				content: messageInput.value,

				createdAt: Date.now(),
			},
		} as SocketIOPayload);

		messageInput.value = '';
		messageInput.focus();
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

		newSocket.on('private message', (data: PrivateMessage) => {
			setChatMessages((state: any) => {
				return [...state, data];
			});

			setTimeout(() => {
				const chatBottom = document.querySelector('#chat-bottom') as HTMLDivElement;
				chatBottom.scrollIntoView({ block: 'end' });
			}, 100);
		});

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
										{/* Here will be the last message sent inside a span */}
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
								{chatMessages.map((message: PrivateMessage) => {
									return (
										<motion.div
											variants={{
												sent: {
													marginLeft: '350px', // If the user sent the message
												},
												received: {
													marginLeft: '-350px', // If the user got the message
												},
												hidden: {
													margin: '0px',
												},
											}}
											animate={'hidden'}
											initial={message.userID == props.user.userID ? 'sent' : 'received'}
											transition={{
												duration: 0.2,
											}}
											key={message.messageID}
											className={styles['message']}
										>
											<div className={message.userID == props.user.userID ? styles['sent-by-user'] : styles['sent-to-user']}>
												{message.content}
												<br />
												<div title={new Date(message.createdAt).toLocaleString()} className={styles['timestamp']}>
													{new Date(message.createdAt).toLocaleTimeString()}
												</div>
											</div>
										</motion.div>
									);
								})}

								<div className="" id="chat-bottom"></div>
							</div>

							<div className={styles['message-input']}>
								<button onClick={sendMessage}>
									<img src="/assets/svg/add-attachment-icon.svg" alt="add-attachment-icon" />
								</button>
								<textarea
									onKeyDown={(event: any) => {
										if (event.target.value.length > 2000) {
											event.target.value = event.target.value.substring(0, 2000);
											return event.preventDefault();
										}

										if (event.key == 'Enter') {
											if (!openChat.userID || event.shiftKey) return;
											event.preventDefault();
											sendMessage();
										}
									}}
									id="message-input"
									placeholder="Message..."
									onInput={(event: any) => {
										if (event.target.scrollHeight > 70) return;
										event.target.style.height = 60;
										event.target.style.height = event.target.scrollHeight + 'px';
									}}
								/>
								<button onClick={sendMessage}>
									<img src="/assets/svg/send-message-icon.svg" alt="send-message-icon" />
								</button>
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
