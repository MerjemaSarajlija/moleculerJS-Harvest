const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');

const UserMethods = require ('../user/user.methods');
const UserActions = require('../user/user.actions');
const AccessMixin = require('../../mixins/access.mixin');

const config = require('../../config');

module.exports = {
	name: 'user',

	mixins: [
		DbService(),
		ResponseMethods(),
        UserActions(),
		UserMethods(),
		AccessMixin()
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};