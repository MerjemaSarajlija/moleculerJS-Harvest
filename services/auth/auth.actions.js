const crypto = require('crypto');




module.exports = function () {
	return {
		actions: {
			login: {
				rest: 'POST /login',
				params: {
					EMAIL: {type: 'string'},
					PASSWORD: { type: 'string', min: 6, pattern: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,20}$/ }
				},
				async handler(ctx) {
					const { email,password } = ctx.params;
					console.log("email from actions " + email);
					const user = await this.getUser(email);
					if (!user) {
						return this.errorUsernameOrPassword();
					}
					const { ID, FIRST_NAME, LAST_NAME, ACCESS, COMPANY, HASH, EMAIL, SALT } = user;
					const newHash = crypto.pbkdf2Sync(password ,SALT, 1000, 64, 'sha512').toString('hex');
					if (HASH !== newHash) {
						return this.errorUsernameOrPassword();
					}
					return {
						success: true,
						message: 'User logged in successfully',
						data: {
							ID,
							EMAIL,
							FIRST_NAME,
							LAST_NAME,
							ACCESS,
							COMPANY,
							accessToken: this.createJwtToken(ID, EMAIL, ACCESS, COMPANY)
						}
					};
				}
			},
		}
	};
};