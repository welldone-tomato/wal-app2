'use strict';

const ApplicationError = require('../../libs/application-error');
const bankUtils = require('../../libs/utils');

const FileModel = require('./base/fileModel');


// const DATA_SOURCE = path.join(__dirname, '..', 'data/cards.json');



class Transactions extends FileModel{
	constructor () {
		// this._dataSource = new FileModel('cards.json');
		super('transactions.json');
	}




	/*
	* проверяем все ли необходимые поля прилетели
	* существует ли такая карта у нас 
	* возвращаем очищенную транзакцию если она прошла проверки
	*/
	_validateTransaction (transactionData) {
		const types_available = ["paymentMobile", "prepaidCard", "card2Card"];
		let result = {valid: false, data: {}, reason:''};
		if (!transactionData.hasOwnProperty('type')) {
			result.reason = 'type missing';
			// result.valid = false;
			return result;
		}
		if (!transactionData.hasOwnProperty('data')) {
			result.reason = 'data missing';
			// result.valid = false;
			return result;
		}
		if (!transactionData.hasOwnProperty('sum')) {
			result.reason = 'sum missing';
			// result.valid = false;
			return result;
		}
		if (!transactionData.hasOwnProperty('cardId')) {
			result.reason = 'cardId missing';
			// result.valid = false;
			return result;
		}
		if (types_available.indexOf(transactionData.type) == -1) {
			result.reason = 'wrong type';
			// result.valid = false;
			return result;
		}
		if (parseInt(transactionData.sum) == NaN) {
			result.reason = 'wrong sum';
			// result.valid = false;
			return result;
		}
		if (!transactionData.hasOwnProperty('cardId')) {
			result.reason = 'cardId missing';
			// result.valid = false;
			return result;
		}
		if (parseInt(transactionData.cardId) == NaN) {
			result.reason = 'wrong cardId';
			// result.valid = false;
			return result;
		}

		result.valid = true;
		result.data = {
			type: transactionData.type,
			sum: transactionData.sum,
			data: transactionData.data,
			cardId: parseInt(transactionData.cardId)
		}

		if (transactionData.hasOwnProperty('commission')) {
			result.data.commission = transactionData.commission;
		}

		return result;


	}

	async get(cardId) {
		return await this.getAllByCondition(['cardId',cardId]);
	}

	async create (transactionData) {
		// const card = Cards
		const validated = this._validateTransaction(transactionData);
		if (validated.valid) {
			let transaction = validated.data;
			// autoincrement =) with reduce 
			transaction.id = this._dataSource.reduce((max, item) => Math.max(max, item.id), 0) + 1;
			transaction.time = (new Date()).toISOString();	
			this._dataSource.push(transaction);
			await  this._saveUpdates();
			return transaction;	
		} else {
			throw new ApplicationError('Transaction data is invalid. Reason: '+validated.reason, 400);
		}
	}

	async getAllByCondition (condition) {
		const transactions = await this.getAll();
		return transactions.filter((item) => item[condition[0]] == condition[1]);
	}


	/**
	 * Удаляет транзакцию
	 * @param {Number} id идентификатор карты
	 */
	async remove (id) {
		throw new ApplicationError('Remove transactions is denied', 400);
	}

	/**
	 * Сохраняет изменения
	 * @private
	 */
	// _saveUpdates () {
	// 	fs.writeFileSync(DATA_SOURCE, JSON.stringify(this._dataSource, null, 4));
	// }
}

module.exports = Transactions;
