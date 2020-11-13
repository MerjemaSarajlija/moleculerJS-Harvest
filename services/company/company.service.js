const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');

const CompanyMethods = require ('../company/company.methods');
const CompanyActions = require('../company/company.actions')

const config = require('../../config');

module.exports = {
	name: 'company',

	mixins: [
		DbService(),
		ResponseMethods(),
        CompanyActions(),
        CompanyMethods()
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};