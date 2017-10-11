'use strict';

// const CardsModel = require('../../models/cards');

// module.exports = (req, res) => res.json(new CardsModel().getAll());

module.exports = async (ctx) => {
	ctx.body = await ctx.CardsModel.getAll();
};
