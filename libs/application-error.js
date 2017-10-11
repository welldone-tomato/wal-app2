'use strict';

class ApplicationError extends Error {
	constructor (message, status) {
		super(message);
		this._status = status;
		console.log(message);
	}

	/**
	 * Возвращает статус ошибки
	 * @returns {*}
	 */
	get status () {
		return this._status;
	}
}

module.exports = ApplicationError;
