let _ = require("lodash");

module.exports = function () {
	return {
		actions: {
			
		/*	insertCompany: {
				rest: 'POST /insertCompany',
				params: {
					NAME: { type: 'string' },  //COMPANY NAME
					EMAIL: { type: 'string' },
					FIRST_NAME: { type: 'string' },
					LAST_NAME: { type: 'string' },
					PASSWORD: { type: 'string' }
				},
				async handler(ctx) {
					try {
						console.log(1)
						console.log(ctx.params)
						const { NAME, EMAIL, FIRST_NAME, LAST_NAME, PASSWORD } = ctx.params
						const tableName = "company";
						//const client = await this.insert(tableName, { NAME });
						const { ID } = client;
						const USER = ctx.call("user.registerUser", { COMPANY: ID, EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, ACCESS: "ADMIN" });
					} catch (error) {
						return Promise.reject(new Errors.MoleculerError(error.message, 400));
					}
				}
			},*/
		},
	};
}