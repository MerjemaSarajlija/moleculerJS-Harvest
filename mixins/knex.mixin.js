const knex = require('knex');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');


module.exports = function () {
	return {
		methods: {
			getOptionsFromParams(params, defaultPageSize) {
				const options = {};
				const { page, pageSize, order } = params;
				options.sort = params.sort ? params.sort : [];
				let currentPage = page ? Number(page) : 1;
				let perPage = pageSize ? Number(pageSize) : defaultPageSize || 10;
				if (perPage > 200) perPage = 200;
				options.page = currentPage;
				options.pageSize = perPage;
				options.order = params.order ? params.order : "ASC"
				options.fields = params.fields ? params.fields.split(',') : [];
				return options;
			},

			
			pagesStr() {
				const { pageSize, page } = this.settings.options;
				const offset = (page - 1) * pageSize;
				return `LIMIT ${pageSize} OFFSET ${offset}`;
			},
			
			orderStr() {
				const orderBy = [];
				_.forEach(this.settings.options.sort, (item) => {
					let desc = false;
					let param = item;

					if (param[0] === '-') {
						desc = true;
						param = param.replace('-', '');
					}
					orderBy.push(`${param} ${desc ? 'DESC' : 'ASC'}`);
				});

				if (orderBy.length) {
					return `ORDER BY  ${orderBy.join(', ')}`;
				}

				return '';
			},

	

			async updateByFields(tableName, valueObject, fields) {
				await this.db(tableName).where(fields).update(valueObject);
			},

			async insert(tableName, valueObject) {
				const newId = uuidv4();
				valueObject.ID = newId;
				await this.db(tableName).insert(valueObject);
				const result = valueObject;
				return result;
			},
			

		},


		started() {
			this.db = knex({
				client: 'mysql',
				connection: this.settings.connection
			});
			const that = this;
			function dbConnectionCheck(name) {
				return Promise.resolve()
					.then(() => {
						if (that.db)
							return that.db.raw('SELECT 1+1 AS result');
					})
					.then(() => {
						that.logger.info('MySQL connect successfully.');
					})
					.catch(err => {
						that.logger.error(err);
						that.logger.error(`MySQL failed to connect! [${name}] service`);
						// Check if this should return an error
						// return Promise.reject(new Error(`PostgreSQL failed to connect! [${this.name}] service`));
					});
			}
			return dbConnectionCheck(this.name);
		}
	};
}