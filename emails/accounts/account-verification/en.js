module.exports = {
	subject: 'Verify your email address',
	html: `
	<div style="text-align: center">
	<div class="main">
		<h1>Zappit Email Verification Process</h1>
		<p>Hello {username}, we've recieved a request from you to verify your email</p>

		<br />
		<a
			style="
				background-color: #8c78fa;
				text-decoration: none;
				padding: 15px;
				color: white !important;
				border-radius: 10px;
				font-size: 20px;
				font-weight: bold;
			"
			href="https://zappit.gg/api/private/accounts/verifyEmail?token={verification_token}"
			>Verify My Email</a
		>

		<br /><br />
		<p> If that doesn't work, copy and paste the following link into your browser: </p>
		<p>https://zappit.gg/api/private/accounts/verifyEmail?token={verification_token}</p>

		<br /><br />
	</div>

	<div class="footer">
		<p>If you didn't request this email, please ignore it.</p>

		<span>
			<a style="text-decoration: none;" href="https://zappit.gg/support/tos">Terms of service</a> |
			<a  style="text-decoration: none;" href="https://zappit.gg/support/privacy">Privacy policy</a> |
			<a style="text-decoration: none;" href="https://zappit.gg/support/contact">Contact us</a>
		</span>
	</div>
</div>
`,
	text: `Hello username_placeholder, we've recieved a request from you to verify your email`,
};
