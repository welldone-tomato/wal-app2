'use strict';
// const CardsModel = require('../../models/cards');

module.exports = async (ctx) => {

	const card = ctx.request.body;
	// console.log(req.body);
	try {
		// const newCard = cardsModel.createOrUpdate(card);
		const newCard = await ctx.CardsModel.createOrUpdate(card);
		// res.status(201).json(newCard);
		ctx.status = 201;
		ctx.body = newCard;
	} catch (err) {
		// console.log(err);
		ctx.status = err.status;
		
	}
};
