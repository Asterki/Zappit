import React from 'react';
import $ from 'jquery';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import { Form, FloatingLabel, InputGroup } from 'react-bootstrap';

import styles from '../../styles/accounts/register.module.scss';
import type { NextPage } from 'next';

const Register: NextPage = (props) => {
	const particlesInit = React.useCallback(async (engine: any) => {
		await loadFull(engine);
	}, []);

	const changeTab = (currentTab: string, tabToChangeTo: string) => {
		$(`#${currentTab}`).fadeOut(500);
		setTimeout(() => {
			$(`#${tabToChangeTo}`).fadeIn(500);
		}, 500);
	};

	React.useEffect(() => {
		$(`#email-page`).fadeIn(500);
		$(`#particles`).fadeIn(3000);
	}, []);

	return (
		<div className={styles['page']}>
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

			<header>
				<img src="/assets/svg/logo.svg" alt="Zappit Logo" />
				<h1>Register Into Zappit</h1>
			</header>

			<div className={styles.center}>
				<main>
					<Form action="/api/accounts/register" method="POST">
						<Form.Group id="email-tab" className={`${styles['tab']} ${styles['tab-active']}`}>
							<InputGroup className="custom-input shadow-none">
								<FloatingLabel controlId="floatingInput" label="Your Name">
									<Form.Control type="text" placeholder="Your Name" />
								</FloatingLabel>
							</InputGroup>
							<br />
							<br />

							<InputGroup className="custom-input shadow-none">
								<FloatingLabel controlId="floatingInput" label="Username">
									<Form.Control type="text" placeholder="Username" />
								</FloatingLabel>
							</InputGroup>
							<br />
							<br />

							<InputGroup className="custom-input shadow-none">
								<FloatingLabel controlId="floatingInput" label="Email">
									<Form.Control type="email" placeholder="Email" />
								</FloatingLabel>
							</InputGroup>
							<br />
							<br />

							<button
								className={styles['next-button']}
								onClick={(e: any) => {
									e.preventDefault();
									changeTab('email-tab', 'password-tab');
								}}
							>
								Next
							</button>
						</Form.Group>
						<Form.Group id="password-tab" className={styles['tab']}>
							<InputGroup className="custom-input shadow-none">
								<FloatingLabel controlId="floatingInput" label="Password">
									<Form.Control type="password" placeholder="Your password" />
								</FloatingLabel>
							</InputGroup>
							<br />
							<br />

							<InputGroup className="custom-input shadow-none">
								<FloatingLabel controlId="floatingInput" label="Confirm your password">
									<Form.Control type="email" placeholder="Your password" />
								</FloatingLabel>
							</InputGroup>
							<br />
							<br />

							<button
								className={styles['next-button']}
								onClick={(e: any) => {
									e.preventDefault();
									changeTab('email-tab', 'username-tab');
								}}
							>
								Register
							</button>
						</Form.Group>
					</Form>
				</main>
			</div>
		</div>
	);
};

export default Register;
