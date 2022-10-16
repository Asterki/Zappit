import React from 'react';
import $ from 'jquery';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import { Input } from 'antd';

import styles from '../../styles/accounts/register.module.scss';
import type { NextPage } from 'next';

const Register: NextPage = (props) => {
	const particlesInit = React.useCallback(async (engine: any) => {
		await loadFull(engine);
	}, []);

	React.useEffect(() => {
		$(`#main-page`).fadeIn(1000);
		$(`#particles`).fadeIn(3000);
	}, []);

	return (
		<div className={styles['page']}>
			<div id="particles">
				<Particles
					init={particlesInit}
					options={{
						particles: {
							number: {
								value: 60,
								density: {
									enable: true,
									value_area: 800,
								},
							},
							shape: {
								polygon: {
									nb_sides: 5,
								},

								type: 'circle',
							},
							line_linked: {
								enable: false,
							},
							opacity: {
								value: 0.3,
							},
							size: {
								value: 3,
								random: true,
								anim: {
									enable: false,
									speed: 20,
									size_min: 0.3,
									sync: false,
								},
							},
							move: {
								direction: 'none',
								enable: true,
								outMode: 'bounce',
								random: false,
								speed: 0.3,
								straight: false,
							},
						},
					}}
				/>
			</div>

			<div className={styles.center}>
				<header>
					<img src="/assets/svg/logo.svg" alt="Zappit Logo" />
					<h1>Register Into Zappit</h1>
				</header>

				<main>
					<form action="/api/accounts/register" method="POST">
						<div id="email-tab">
							<label htmlFor="text">Username</label>
							<Input
								className={styles['input']}
								addonBefore="@"
								allowClear
								type="text"
								name="username"
								placeholder="Username"
								aria-label="username input"
							/>
							<br />

							<label htmlFor="text">Email</label>
							<Input type="text" addonBefore="@" allowClear status="error" name="email" placeholder="asterki.dev@proton.me" aria-label="username input" />
							<br />

							<button>Next</button>
						</div>

						<div id="username-tab" hidden>
							<label htmlFor="text">Username</label>
							<Input type="text" name="username" placeholder="Username" aria-label="username input" />
							<br />

							<label htmlFor="text">Your Name</label>
							<Input type="text" name="email" placeholder="asterki.dev@proton.me" aria-label="username input" />
							<br />

							<input type="submit" value="Submit" />
						</div>
						<div id="password-tab" hidden>
							<label htmlFor="text">Username</label>
							<Input type="text" name="username" placeholder="Username" aria-label="username input" />
							<br />

							<label htmlFor="text">Email</label>
							<Input type="text" name="email" placeholder="asterki.dev@proton.me" aria-label="username input" />
							<br />

							<input type="submit" value="Submit" />
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default Register;
