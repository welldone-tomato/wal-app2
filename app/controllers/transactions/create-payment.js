'use strict';
// const ApplicationError = require('libs/application-error');

module.exports = async (ctx) => {




	const payment_details = ctx.request.body;
	console.log(payment_details);
	try {
		const card_id = ctx.params['id'];
		// check if this card exists
		// const card_info = ctx.CardsModel.getObjectAndPositionInSourceByCustomCondition(['cardNumber', card_id]);
		const card_info = ctx.CardsModel.getObjectAndPositionInSourceByCustomCondition(['id', card_id]);
		
		// console.log(card_info);
		card_info.data.balance = parseInt(card_info.data.balance) - parseInt(payment_details.paymentAmount) - (('paymentCommission' in payment_details) ? parseInt(payment_details.paymentCommission) : 0) + '';


		const saved_card = await ctx.CardsModel.update(card_info.data, card_info.index);
		let transaction = {
	        "cardId": card_id,
	        "type": "paymentMobile",
	        "data": payment_details.phoneNumber,
	        "sum": payment_details.paymentAmount,
	    };

	    if ('paymentCommission' in payment_details) {
	    	transaction.commission = payment_details.paymentCommission;
	    }
	    console.log(transaction);


		const saved_transaction = await ctx.TransactionsModel.create(transaction/*, options*/);
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
		


		ctx.body = JSON.stringify({result: 'success', data: {saved_transaction, saved_card}});
		ctx.status = 201;
	} catch (err) {
		// console.log(err);
		ctx.status = err.status;
		
	}
};
