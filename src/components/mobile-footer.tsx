/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styles from './mobile-footer.module.scss';

const MobileFooter = (props: any): JSX.Element => {
	return (
		<div className={styles['component']}>
			<button>
				<img src="/assets/svg/home-icon.svg" alt="explore-icon" />
			</button>
			<button>
				<img src="/assets/svg/explore-icon.svg" alt="explore-icon" />
			</button>
			<button>
				<img src="/assets/svg/search.svg" alt="explore-icon" />
			</button>
			<button>
				<img src="/assets/svg/chat-icon.svg" alt="explore-icon" />
			</button>
			<button className={styles["profile-button"]}>
				<img src={`${props.mediaServiceURI}/avatars/${props.user.userID}/${props.user.avatar}.png?q=1`} alt="avatar" />
			</button>
		</div>
	);
};

export default MobileFooter;
