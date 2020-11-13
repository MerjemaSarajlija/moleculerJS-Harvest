const { MoleculerClientError } = require('moleculer').Errors;
const { Errors } = require('moleculer');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = function () {
	return {
		methods: {
			createJwtToken(ID, EMAIL, ACCESS, COMPANY) {
				const { JWT_PRIVATE_KEY, JWT_ACCESS_TOKEN_EXPIRES_IN } = this.settings;
				const token = jwt.sign(
					{
						ID,
						EMAIL,
						ACCESS,
						COMPANY
					},
					JWT_PRIVATE_KEY,
					{
						algorithm: 'RS256',
						expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN
					}
				);
				return token;
			},
			async getUser(email) {
				return await this.db('user').where({ EMAIL: email}).first();
			},

			errorUsernameOrPassword() {
				return Promise.reject(new MoleculerClientError('Incorrect username or password', 403));
			},
		}
	};
};