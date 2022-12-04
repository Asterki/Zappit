/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import axios from 'axios';
import { getLangFile } from '../../utils/pages';

import Navbar from '../../components/navbar';
import MobileFooter from '../../components/mobile-footer';

import styles from '../../styles/accounts/login.module.scss';
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
			cdnURI: process.env.CDN_URI,
			lang: getLangFile(context.req.headers['accept-language'], 'main', 'home'),
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

const Home: NextPage = (props: any): JSX.Element => {
	return (
		<div className={styles['page']}>
			<Navbar className={styles["navbar"]} lang={props.lang} user={props.user} cdnURI={props.cdnURI} />

			

			<MobileFooter className={styles["mobile-footer"]} lang={props.lang} user={props.user} cdnURI={props.cdnURI} />
		</div>
	);
};

export default Home;
