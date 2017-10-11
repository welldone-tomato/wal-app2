'use strict';

const ApplicationError = require('../../libs/application-error');
const bankUtils = require('../../libs/utils');

const FileModel = require('./base/fileModel');


// const DATA_SOURCE = path.join(__dirname, '..', 'data/cards.json');

class Cards extends FileModel{
	constructor () {
		// this._dataSource = new FileModel('cards.json');
		super('cards.json');
	}

	/**
	 * поиск карты по card_number
	 *
	 */
	// findCardByCardNumber (card_number) {
	// 	return this._dataSource.find((item, index) => {
	// 		return item.cardNumber === card_number;
	// 	});
	// }

	// getPositionInBaseById (id) {
	// 	return this._dataSource.findIndex(x => x.id==id);
	// }

	getPositionInSourceByCustomCondition (condition) {
		return this._dataSource.findIndex(x => x[condition[0]]==condition[1]);
	}

	getObjectAndPositionInSourceByCustomCondition (condition) {
		let a = {
			index: this._dataSource.findIndex(x => x[condition[0]]==condition[1])
		};
		a.data = this._dataSource[a.index];
		return a;
	}

	async createOrUpdate (card) {
		const isDataValid = card 
								&& card.hasOwnProperty('cardNumber') 
								&& card.hasOwnProperty('balance') ;

		if (isDataValid) {
			if(!bankUtils.checkCardNumber(card.cardNumber)) {
				throw new ApplicationError('Bad Card Number', 400);
			}
			if (!bankUtils.checkBalance(card.balance)) {
				throw new ApplicationError('Bad Card Balance', 400);
			}
			// const same_card_index = this.findCardByCardNumber(card.cardNumber);
			const same_card_index = this.getPositionInSourceByCustomCondition(['cardNumber', card.cardNumber]);
			if (same_card_index != -1) {
				this.update(card, same_card_index);
			} else {
				this.create(card);
			}
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	async update (card, card_index) {
		const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance');
		console.log('update info');
		console.log(card, card_index);
		if (isDataValid) {
			// const card_index = this.getPositionInBaseById(id);
			// const card_index = this.getPositionInSourceByCustomCondition(['id', id]);
			// if (!card_index) {
			// 	throw new ApplicationError(`Card with ID=${id} not found. Can't update record`, 404);
			// }
			// this._dataSource[card_index].cardNumber = card.cardNumber;
			this._dataSource[card_index].balance = card.balance;
			await this._saveUpdates();
			return card;	
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	/**
	 * Добавляет карту
	 *
	 * @param {Object} card описание карты
	 * @returns {Object}
	 */
	async create (card) {
		const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance');
		if (isDataValid) {
			// autoincrement =) with reduce 
			card.id = this._dataSource.reduce((max, item) => Math.max(max, item.id), 0) + 1;
			this._dataSource.push(card);
			await  this._saveUpdates();
			return card;	
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	/**
	 * Удаляет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove (id) {
		const card_index = this.getPositionInSourceByCustomCondition(['id', id]);
		console.log(id, card_index);
		if (card_index === -1) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}
		this._dataSource.splice(card_index, 1);
		await this._saveUpdates();
	}

	/**
	 * Сохраняет изменения
	 * @private
	 */
	// _saveUpdates () {
	// 	fs.writeFileSync(DATA_SOURCE, JSON.stringify(this._dataSource, null, 4));
	// }
}

module.exports = Cards;
