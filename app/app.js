'use strict';

const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const serve = require('koa-static');
const router = require('koa-router')();

const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create-card');
const deleteCardController = require('./controllers/cards/delete-card');

const getTransactionsController = require('./controllers/transactions/get-transactions');
const createTransactionController = require('./controllers/transactions/create-transaction');
const deleteTransactionController = require('./controllers/transactions/delete-transaction');
const createPaymentTransactionController = require('./controllers/transactions/create-payment');

const ApplicationError = require('libs/application-error');
const baseController = require('./controllers/base/index');
const errorController = require('./controllers/errors/error');
const CardsModel = require('app/models/cards');
const TransactionsModel = require('app/models/transactions');



// SSR
const {renderToString} = require('react-dom/server');
const {renderToStaticMarkup} = require('react-dom/server');
// CSS + SSR
const {extractCritical} = require('emotion-server');
const serialize = require('serialize-javascript');



const logger = require('libs/logger')('wallet-app');

const app = new Koa();


function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views/bundles', `${viewId}.server.js`);
	return require(viewPath);
}
const DATA = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

// cards routes
router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

// transactions routes
router.get('/cards/:id/transactions', getTransactionsController);
router.post('/cards/:id/transactions', createTransactionController);
router.delete('/cards/:id/transactions', deleteTransactionController);

router.post('/cards/:id/pay', createPaymentTransactionController);

// error routes
router.all('/error', errorController);

// web client routes
router.get('/', (ctx) => {

	// only client
	// ctx.body = fs.readFileSync('./web/index.html', 'utf8');

	// SSR
	/*const indexView = require(path.resolve(__dirname, 'views/bundles', `index.server.js`))
	const indexViewHtml = renderToString(indexView());
	ctx.body = `<html>
					<head>
						<meta charset="utf-8">
						<link rel="shortcut icon" href="/web/favicon.ico">
						<title>Hello, Node School App!</title>
						<link rel="stylesheet" href="./bundles/index.css">
					</head>
					<body>
						<div id="root">${indexViewHtml}</div>
						<!--<script src="./bundles/index.js"></script>-->
					</body>
				</html>`;*/

	// CSS + SSR  my version
	/*const indexView = require(path.resolve(__dirname, 'views/bundles', `index.server.js`))
	const indexViewHtml = renderToString(indexView());
	// console.log(indexViewHtml);
	const {html, ids, css} = extractCritical(indexViewHtml);
	// console.log({html, ids, css});

	ctx.body = `<html>
					<head>
						<meta charset="utf-8">
						<link rel="shortcut icon" href="/web/favicon.ico">
						<title>Hello, Node School App!</title>
						<link rel="stylesheet" href="./bundles/index.css">
						<style type="text/css">${css}</style>
					</head>
					<body>
						<div id="root">${html}</div>
						<script>window.__data = ${serialize({ids})};</script>
						<!--<script src="./bundles/index.js"></script>-->
						<script src="./bundles/index.js"></script>
					</body>
				</html>`;*/
	// better version
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(DATA));
	ctx.body = indexViewHtml;
})


router.param(['id'], (req, res, next) => next());







// logger
app.use(async function(ctx, next) {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
	logger.log('info', `${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		// console.log('Error detected', err);
		logger.log('error', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.CardsModel = new CardsModel();
	await ctx.CardsModel.loadFile();
	ctx.TransactionsModel = new TransactionsModel();
	await ctx.TransactionsModel.loadFile();
	await next();
});


app.use(bodyParser);
// app.use(bodyParser.urlencoded());
app.use(router.routes());
app.use(serve('./web'));


app.listen(3000, () => {
	console.log('Application started');
	logger.log('info', 'Application started');
});

