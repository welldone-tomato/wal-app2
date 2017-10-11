'use strict';


module.exports =  async (ctx) => {
	const transactionId = Number(ctx.params['id']);
	await ctx.TransactionsModel.remove(transactionId);
	ctx.status = 200;
};
