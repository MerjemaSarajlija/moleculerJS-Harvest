const crypto = require('crypto');
const { MoleculerClientError } = require('moleculer').Errors;
const { Errors } = require('moleculer');




module.exports = function () {
	return {
		methods: {

			async checkEmail(email){
				return await this.db("user").where("EMAIL", email).first()
			},
			
			async checkCompany(name){
				return await this.db("company").where("NAME", name).first()
			},
			
			async getTeam(company) {
				return await this.db("user").where("COMPANY", company);
			},

			async findUserById(id) {
				return await this.db("user").where("ID", id).first();
			},

			cleanUser(userObject) {
				return {
					...userObject,
					FIRST_NAME: userObject.FIRST_NAME,
					LAST_NAME: userObject.LAST_NAME,
					EMAIL: userObject.EMAIL,
					PASSWORD: userObject.PASSWORD,
				};
			},
			createPassword(password) {
				const SALT = crypto.randomBytes(16).toString('hex');
				const HASH = crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
				return { SALT, HASH };
			},
		}
	};
};