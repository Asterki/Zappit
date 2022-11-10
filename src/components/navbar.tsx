/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styles from './navbar.module.scss';
import { motion } from 'framer-motion';

const Navbar = (props: any): JSX.Element => {
	const [dropdownOpen, setDropdownOpen] = React.useState(false);

	return (
		<div className={styles['component']}>
			{props.user == undefined && (
				<div className={styles['not-logged-in']}>
					<img src="/assets/svg/logo.svg" alt="Zappit Logo" />
					<h2>{props.lang.topBar}</h2>
				</div>
			)}

			{props.user !== undefined && (
				<div className={styles['logged-in']}>
					<div className={styles['top-bar-left']}>
						<img onClick={() => (window.location.href = '/home')} src="/assets/svg/logo.svg" alt="Zappit Logo" className={styles['logo']} />

						<img className={styles['search-icon']} src="/assets/svg/search.svg" alt="Search Icon" />
						<input type="text" placeholder="Search" />
					</div>

					<div className={styles['top-bar-center']}>
						<button>
							<img src="/assets/svg/friends-icon.svg" alt="friends-icon" />
						</button>
						<button>
							<img src="/assets/svg/chat-icon.svg" alt="chat-icon" />
						</button>
						<button>
							<img src="/assets/svg/explore-icon.svg" alt="explore-icon" />
						</button>
						<button>
							<img src="/assets/svg/notifications-icon.svg" alt="notifications-icon" />
						</button>
						<button>
							<img src="/assets/svg/help-icon.svg" alt="help-icon" />
						</button>
					</div>

					<div className={styles['top-bar-right']}>
						<motion.div
							variants={{
								menuOpen: {
									backgroundColor: '#3f3f3f77',
								},
								menuClosed: {
									backgroundColor: '#1f1f1f',
								},
							}}
							initial={'menuClosed'}
							animate={dropdownOpen ? 'menuOpen' : 'menuClosed'}
							transition={{ duration: 0.1 }}
							className={styles['dropdown-menu-button']}
							onClick={() => {
								setDropdownOpen(!dropdownOpen);
							}}
						>
							<img src={`${props.cdnHost}/avatars/${props.user.userID}/${props.user.avatar}.png?w=20&h=20&crop=true`} alt="avatar" />

							<div className={styles['dropdown-menu-button-text']}>
								<b>{props.user.displayName}</b>
								<a>@{props.user.username}</a>
							</div>

							<motion.img
								variants={{
									open: {
										transform: 'rotate(180deg)',
									},
									closed: {
										transform: 'rotate(0deg)',
									},
								}}
								initial="closed"
								animate={dropdownOpen ? 'open' : 'closed'}
								src="/assets/svg/arrow-down-icon.svg"
								alt="Open Menu"
							/>
						</motion.div>

						<motion.div
							className={styles['dropdown-menu']}
							variants={{
								open: {
									opacity: 1,
									display: 'block',
								},
								closed: {
									opacity: 0,
									transitionEnd: {
										display: 'none',
									},
								},
							}}
							initial="closed"
							animate={dropdownOpen ? 'open' : 'closed'}
							transition={{ duration: 0.1 }}
						>
							<div
								onClick={() => {
									setDropdownOpen(false);
									window.location.href = '/profile';
								}}
							>
								<img src="/assets/svg/profile-icon.svg" alt="Profile" />
								Profile
							</div>
							<div
								onClick={() => {
									setDropdownOpen(false);
									window.location.href = '/profile/settings';
								}}
							>
								<img src="/assets/svg/settings-icon.svg" alt="Settings" />
								Settings
							</div>
							<hr />
							<div>
								<img src="/assets/svg/logout-icon.svg" alt="Logout" />
								Logout
							</div>
						</motion.div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
