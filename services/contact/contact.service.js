const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');
const AccessMixin = require('../../mixins/access.mixin');

const ContactMethods = require ('../contact/contact.methods');
const ContactActions = require('../contact/contact.actions');

const config = require('../../config');

module.exports = {
	name: 'contact',

	mixins: [
		DbService(),
		ResponseMethods(),
        ContactActions(),
		ContactMethods(),
		AccessMixin(),
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};