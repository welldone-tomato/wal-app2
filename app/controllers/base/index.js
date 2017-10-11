'use strict';

module.exports = (req, res) => {
	res.send(`<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Lets build our awesome app!</h1>
			<form action="/cards" method="post">
				<input type="text" name="cardNumber">
				<input type="text" name="cardBalance">
				<input type="submit">
			</form>
		</body>
	</html>`);
};
