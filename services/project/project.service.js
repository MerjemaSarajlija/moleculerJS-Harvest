const DbService = require('../../mixins/knex.mixin');
const ResponseMethods = require('../../mixins/response.mixin');
const AccessMixin = require('../../mixins/access.mixin');

const ProjectMethods = require ('../project/project.methods');
const ProjectActions = require('../project/project.actions');

const config = require('../../config');

module.exports = {
	name: 'project',

	mixins: [
		DbService(),
		ResponseMethods(),
        ProjectActions(),
		ProjectMethods(),
		AccessMixin(),
	],
	settings: {
		connection: config.SERVICES.HARVEST.DB_URL,
		options: {},
	},
};