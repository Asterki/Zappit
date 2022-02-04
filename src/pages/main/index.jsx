import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

import styles from '../../assets/styles/main/index.module.scss';
import * as utils from '../../utils';

export async function getServerSideProps({ req, res }) {
	const response = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/private/pages/main/index`,
		headers: req.headers
	})

	return {
		props: {
			lang: response.data.lang,
		},
	};
}

export default function MainIndex(props) {
	return (
		<div className={styles.page}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<main>
				<h1>Zappit</h1>

				<table>
					<tr>
						<th>Account</th>
						<th>Main</th>
						<th>Profile</th>
					</tr>
					<tr>
						<td>
							<Link href='/login'>Login</Link>
						</td>
						<td>
							<Link href='/'>Main</Link>
						</td>
						<td>Placeholder</td>
					</tr>
					<tr>
						<td>
							<Link href='/api/private/accounts/logout'>Logout</Link>
						</td>

						<td>
							<Link href='/home'>Home</Link>
						</td>
						<td>Placeholder</td>
					</tr>
					<tr>
						<td>
							<Link href='/register'>Register</Link>
						</td>
						<td>Placeholder</td>

						<td>Placeholder</td>
					</tr>
				</table>
			</main>
		</div>
	);
}
