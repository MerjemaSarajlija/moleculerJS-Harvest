const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');

const TimesheetMethods = require ('../timesheet/timesheet.methods');
const TimesheetActions = require('../timesheet/timesheet.actions');
const AccessMixin = require('../../mixins/access.mixin');

const config = require('../../config');

module.exports = {
	name: 'timesheet',

	mixins: [
		DbService(),
		ResponseMethods(),
        TimesheetActions(),
		TimesheetMethods(),
		AccessMixin()
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};