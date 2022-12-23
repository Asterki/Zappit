/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import axios from 'axios';

import Navbar from '../../components/navbar';
import MobileFooter from '../../components/mobile-footer';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import styles from '../../styles/accounts/login.module.scss';

import { User } from 'shared/types/models';
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
			user: JSON.parse(JSON.stringify(context.req.user)),
			sessionID: context.req.sessionID,
		},
	};
};

interface PageProps {
	user: User;
	sessionID: string;
}

const Home: NextPage<PageProps> = (props: PageProps): JSX.Element => {
	const pageState = useSelector((state: RootState) => state.page);
	const lang = pageState.pageLang.main.home;

	return (
		<div className={styles['page']}>
			<div>
				<Navbar
					className={styles['navbar']}
					lang={lang}
					user={props.user}
					mediaServiceURI={pageState.mediaServiceURI}
				/>

                ewqe

				<MobileFooter
					className={styles['mobile-footer']}
					lang={lang}
					user={props.user}
					mediaServiceURI={pageState.mediaServiceURI}
				/>
			</div>
		</div>
	);
};

export default Home;
