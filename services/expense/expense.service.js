const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');
const AccessMixin = require('../../mixins/access.mixin');

const ExpenseMethods = require ('../expense/expense.methods');
const ExpenseActions = require('../expense/expense.actions');

const config = require('../../config');

module.exports = {
	name: 'expense',

	mixins: [
		DbService(),
		ResponseMethods(),
        ExpenseActions(),
		ExpenseMethods(),
		AccessMixin(),
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};