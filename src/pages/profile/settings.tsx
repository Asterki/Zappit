/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';
import QRCode from 'qrcode';

import { getLangFile } from '../../utils/pages';

import { motion } from 'framer-motion';

import styles from '../../styles/settings/index.module.scss';
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
			cdnURI: process.env.CDN_URI,
			lang: getLangFile(context.req.headers['accept-language'], 'settings', 'index'),
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

const Profile: NextPage = (props: any): JSX.Element => {
	const [activeTab, setActiveTab] = React.useState('accounts');
	const [tfaCodeImage, setTfaCodeImage] = React.useState('');

	const activateTfa = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/user-settings/activate-tfa`,
		});

		console.log(response.data.code);

		QRCode.toDataURL(response.data.code, (err, url) => {
			setTfaCodeImage(url);
		});
	};

	const getBackupCodes = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/user-settings/get-backup-tfa-codes`,
			data: {
				tfaCode: (document.querySelector('#backup-tfa-code-input') as HTMLInputElement).value,
			},
		});

		console.log(response.data);
	};

	const deactivateTfa = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/user-settings/deactivate-tfa`,
			data: {
				tfaCode: (document.querySelector('#deactivate-tfa-code-input') as HTMLInputElement).value,
			},
		});

		console.log(response);
	};

	const userSettingsButtons = [
		{ tab: 'accounts', label: 'My Account' },
		{ tab: 'privacy', label: 'Privacy & Safety' },
		{ tab: 'security', label: 'Security' },
	].map((element: { tab: string; label: string }) => {
		return (
			<div key={element.tab}>
				<motion.button
					onClick={() => setActiveTab(element.tab)}
					variants={{
						active: {
							backgroundColor: '#272729',
						},
						inactive: {
							backgroundColor: '#161616',
						},
					}}
					transition={{ duration: 0.1 }}
					animate={activeTab == element.tab ? 'active' : 'inactive'}
				>
					{element.label}
				</motion.button>
				<br />
			</div>
		);
	});

	return (
		<div className={styles['page']}>
			<div className={styles['left-bar']}>
				<h4>User Settings</h4>
				{userSettingsButtons}

				<br />

				<h4>App Settings</h4>
			</div>

			<div className={styles['right-bar']}>
				<motion.div
					variants={{
						hidden: {
							opacity: 0,
							transitionEnd: {
								display: 'none',
							},

							transition: {
								duration: 0.1,
							},
						},
						showing: {
							display: 'block',
							opacity: 1,

							transition: {
								duration: 0.1,
								delay: 0.1,
							},
						},
					}}
					animate={activeTab == 'accounts' ? 'showing' : 'hidden'}
					initial={'hidden'}
				>
					<img src={`${props.cdnURI}/avatars/${props.user.userID}/${props.user.avatar}.png?q=1`} alt="avatar" />

					<form action="/api/user-settings/upload-avatar" encType="multipart/form-data" method="post">
						<input type="file" name="avatar" id="yes" accept="image/*" />
						<input type="submit" value="Yes" />
					</form>
				</motion.div>

				<motion.div
					variants={{
						hidden: {
							opacity: 0,
							transitionEnd: {
								display: 'none',
							},

							transition: {
								duration: 0.1,
							},
						},
						showing: {
							display: 'block',
							opacity: 1,

							transition: {
								duration: 0.1,
								delay: 0.1,
							},
						},
					}}
					animate={activeTab == 'privacy' ? 'showing' : 'hidden'}
					initial={'hidden'}
				>
					<h1>jeqwioejqwoiejqwioeqwjeioqwejqw</h1>
				</motion.div>

				<motion.div
					variants={{
						hidden: {
							opacity: 0,
							transitionEnd: {
								display: 'none',
							},

							transition: {
								duration: 0.1,
							},
						},
						showing: {
							display: 'block',
							opacity: 1,

							transition: {
								duration: 0.1,
								delay: 0.1,
							},
						},
					}}
					animate={activeTab == 'security' ? 'showing' : 'hidden'}
					initial={'hidden'}
				>
					<h1>{props.lang.title}</h1>
					<button onClick={activateTfa}>Activate TFA</button>
					<img src={tfaCodeImage} alt="qrcodeImage" />

					<br />
					<br />

					<input type="text" id="backup-tfa-code-input" />
					<button onClick={getBackupCodes}>Get backup codes</button>

					<br />
					<br />
					<input type="text" id="deactivate-tfa-code-input" />
					<button onClick={deactivateTfa}>Deactivate tfa</button>
				</motion.div>
			</div>
		</div>
	);
};

export default Profile;
