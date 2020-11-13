const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');

const AuthMethods = require('./auth.methods');
const AuthActions = require('./auth.actions');

const config = require('../../config');

module.exports = {
	name: 'auth',

	mixins: [
		DbService(),
		ResponseMethods(),
		AuthActions(),
		AuthMethods(),
	],
	settings: {
		JWT_PRIVATE_KEY: config.SERVICES.HARVEST.JWT_PRIVATE_KEY,
		JWT_ACCESS_TOKEN_EXPIRES_IN: config.SERVICES.HARVEST.JWT_ACCESS_TOKEN_EXPIRES_IN,
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};