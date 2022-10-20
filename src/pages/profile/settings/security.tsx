/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { getLangFile } from '../../../utils/pages';

import styles from '../../../styles/settings/security.module.scss';
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
			lang: getLangFile(context.req.headers['accept-language'], 'settings', 'security'),
		},
	};
};

const Profile: NextPage = (props: any) => {
	const [tfaCodeImage, setTfaCodeImage] = React.useState('');

	const activateTfa = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/accounts/activate-tfa`,
		});

		console.log(response.data.code);

		QRCode.toDataURL(response.data.code, (err, url) => {
			setTfaCodeImage(url);
		});
	};

	const getBackupCodes = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/accounts/get-backup-tfa-codes`,
			data: {
				tfaCode: (document.querySelector('#backup-tfa-code-input') as HTMLInputElement).value,
			},
		});

		console.log(response.data);
	};

	const deactivateTfa = async () => {
		const response = await axios({
			method: 'post',
			url: `${props.host}/api/accounts/deactivate-tfa`,
			data: {
				tfaCode: (document.querySelector('#deactivate-tfa-code-input') as HTMLInputElement).value,
			},
		});

		console.log(response);
	};

	return (
		<div className={styles['page']}>
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
		</div>
	);
};

export default Profile;
