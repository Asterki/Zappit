/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import axios from 'axios';

import Navbar from '../../components/navbar';

import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import styles from '../../styles/profile/index.module.scss';

import type { NextPage, GetServerSideProps } from 'next';
import type { User } from '../../../shared/types/models';

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

const Profile: NextPage<PageProps> = (props: PageProps): JSX.Element => {
	const pageState = useSelector((state: RootState) => state.page);
	const lang = pageState.pageLang.profile.index;

	return (
		<div className={styles['page']}>
			<h1>{lang.title}</h1>
			<Navbar lang={lang} user={props.user} />
		</div>
	);
};

export default Profile;
