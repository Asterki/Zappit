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

export default function Profile(props) {
	return (
		<div>
			<h1>Hello Next.js</h1>
		</div>
	);
}
