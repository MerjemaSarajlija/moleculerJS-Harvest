const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');

const ClientMethods = require ('../client/client.methods');
const ClientActions = require('../client/client.actions')
const CheckAccess = require('../../mixins/access.mixin');

const config = require('../../config');

module.exports = {
	name: 'client',

	mixins: [
		DbService(),
		ResponseMethods(),
        ClientActions(),
		ClientMethods(),
		CheckAccess(),
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};