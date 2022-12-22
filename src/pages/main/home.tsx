/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import axios from 'axios';

import Navbar from '../../components/navbar';
import MobileFooter from '../../components/mobile-footer';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import styles from '../../styles/accounts/login.module.scss';

import type { NextPage } from 'next';

const Home: NextPage = (): JSX.Element => {
	const pageState = useSelector((state: RootState) => state.page);
	const userState = useSelector((state: RootState) => state.user);

	const lang = pageState.pageLang.main.home;

	React.useEffect(() => {
		(async () => {
			if (userState.user == null) return (window.location.href = '/login');
		})();
	}, []);

	return (
		<div className={styles['page']}>
			{userState.user !== null && (
				<div>
					<Navbar
						className={styles['navbar']}
						lang={lang}
						user={userState.user}
						mediaServiceURI={pageState.mediaServiceURI}
					/>

					<MobileFooter
						className={styles['mobile-footer']}
						lang={lang}
						user={userState.user}
						mediaServiceURI={pageState.mediaServiceURI}
					/>
				</div>
			)}

			{userState.user == null && <>Loading...</>}
		</div>
	);
};

export default Home;
