
const fs = require('fs');
const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router');
var static = require('koa-static');
const app = new Koa();


const getCardsController = require('./controllers/cards/get-cards');


app.get('/cards', getCardsController);



app.get('/', (req, res) => {
	res.send(`<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
			<form action="/cards" method="post">
				<input type="text" name="cardNumber">
				<input type="text" name="cardBalance">
				<input type="submit">
			</form>
		</body>
	</html>`);
});

app.get('/error', (req, res) => {
	throw Error('Oops!');
});

app.get('/cards', (req, res) => {
	fs.readFile('source/cards.json', (err, data) => {
	  if (err) throw err;
	  // res.end(data);
	  const cards = JSON.parse(data);
	  console.log(cards);
	  var result = [];
	  for (var i=0; i < cards.length; i++) {
	  	// console.log(cards[i]);
	  	result.push(cards[i].cardNumber + ': ' + cards[i].balance);
	  }
	  res.end(result.join('\n'));
	});
});

app.delete('/cards/:id', function(req, res) {
	console.log(4567);
	const index = parseInt(req.params.id);
	if (isNaN(index)) {
		throw 'bad index';
	}

	fs.readFile('source/cards.json', (err, data) => {
	  if (err) throw err;
	  const cards = JSON.parse(data);
	  if (cards[index]) {
	  	cards.splice(index,1);
	  	fs.writeFile('source/cards.json', JSON.stringify(cards), (err, data) => {
	  		 if (err) throw err;
	  	});
	  	res.end('Success');

	  } else {
	  	res.statusCode = 404;
	  	res.end('Card not found');
	  }
	})

})

app.post('/cards', function(req, res) {
    
    function checkCC(cc) {
    	// https://gist.github.com/dimiork/75d8b1288171fba45d71
    	function Moon(card_number) {

		  var arr = [],
		      card_number = card_number.toString();
		  for(var i = 0; i < card_number.length; i++) {
		    if(i % 2 === 0) {
		      var m = parseInt(card_number[i]) * 2;
		      if(m > 9) {
		        arr.push(m - 9);
		      } else {
		        arr.push(m);
		      } 
		    } else {
		        var n = parseInt(card_number[i]);
		        arr.push(n)
		      }
		  }
		  //console.log(arr);
		  var summ = arr.reduce(function(a, b) { return a + b; });
		  return Boolean(!(summ % 10));
		}
    	return Moon(cc) ? true : false;
    }
    function chechBalance(balance) {
    	if (typeof balance == "string" || typeof balance == "number")
    		return true;
    	return false;
    }

    const new_card = {
    	cardNumber: req.body.cardNumber,
    	balance: req.body.cardBalance
    };
    console.log(new_card);
    
    if (!checkCC(new_card.cardNumber)) {
    	res.statusCode = 400;
    	res.end('bad card');
    }

    if (!chechBalance(new_card.balance)) {
    	res.statusCode = 400;
    	res.end('bad balance');
    }

    // res.end(req.body.cardNumber);

    fs.readFile('source/cards.json', (err, data) => {
	  if (err) throw err;
	  const cards = JSON.parse(data);
	  
	  var result = 0;
	  for (var i=0; i < cards.length; i++) {
	  	if (!result && cards[i].cardNumber == new_card.cardNumber) {
	  		cards[i].balance = new_card.balance;
	  		result = 1;
	  	}
	  }
	  if (!result) {
	  	cards.push(new_card);
	  	result = 2;
	  }
	  console.log(result);
	  if (result == 1)  {
	  	res.end('updated');
	  } else if (result == 2) {
	  	res.end('added');
	  } else {
	  	res.end('error');
	  }
	  
	  if (result) {
	  	fs.writeFile('source/cards.json', JSON.stringify(cards), (err, data) => {
	  		 if (err) throw err;
	  	});
	  }
	});
});



app.get('/transfer', (req, res) => {
	const {amount, from, to} = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	});
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
