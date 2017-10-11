'use strict';
// const ApplicationError = require('libs/application-error');

module.exports = async (ctx) => {




	const payment_details = ctx.request.body;
	console.log(payment_details);
	try {
		const card_id = ctx.params['id'];
		// check if this card exists
		const card_info = ctx.CardsModel.getObjectAndPositionInSourceByCustomCondition(['cardNumber', card_id]);
		
		// console.log(card_info);
		card_info.data.balance = parseInt(card_info.data.balance) - parseInt(payment_details.paymentAmount) + '';


		await ctx.CardsModel.update(card_info.data, card_info.index);
		await ctx.CardsModel.update(card_info.data, card_info.index);
		const transaction = {
	        "cardId": card_info.index,
	        "type": "paymentMobile",
	        "data": payment_details.phoneNumber,
	        "sum": payment_details.paymentAmount,
	    };


		await ctx.TransactionsModel.create(transaction/*, options*/);
		// update

		// console.log(card_index);
		// if (card_index === -1) {
		// 	throw new ApplicationError(`Card with ID=${card_id} not found`, 404);
		// 	return '';
		// }

		// transaction.cardId = card_id;
		// const newTransaction = await ctx.TransactionsModel.create(transaction/*, options*/);
		// ctx.status = 201;
		// ctx.body = newTransaction;
		


		ctx.body = 'asdgas';
		ctx.status = 201;
	} catch (err) {
		// console.log(err);
		ctx.status = err.status;
		
	}
};
