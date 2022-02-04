import React from 'react';

export async function getServerSideProps({ req, res }) {
	if (req.user == undefined)
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};

	return { props: {} };
}

export default function MainHome(props) {
	return (
		<div>
			<h1>Hello Next.js</h1>
			<a href='/api/private/accounts/logout'>Logout</a> <br />
			<a href='/verify-email'>Verify Email</a>
		</div>
	);
}
