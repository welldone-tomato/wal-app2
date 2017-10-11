'use strict';
// const ApplicationError = require('libs/application-error');

module.exports = async (ctx) => {

	const transaction = ctx.request.body;
	// console.log(req.body);
	try {
		// const options = {'cardId': ctx.params['id']};
		// manual add cardID
		// search for card firstly
		const card_id = ctx.params['id'];
		// check if this card exists
		const card_index = ctx.CardsModel.getPositionInSourceByCustomCondition(['id', card_id]);
		// console.log(card_index);
		if (card_index === -1) {
			// throw new ApplicationError(`Card with ID=${card_id} not found`, 404);
			return '';
		}

		transaction.cardId = card_id;
		const newTransaction = await ctx.TransactionsModel.create(transaction/*, options*/);
		ctx.status = 201;
		ctx.body = newTransaction;
	} catch (err) {
		// console.log(err);
		ctx.status = err.status;
		
	}
};
