let _ = require("lodash");
const crypto = require('crypto');


module.exports = function () {
	return {
		actions: {
			signUp: {
				rest: 'POST /signUp',
				params: {
					NAME : {type: 'string'}, //company name
					EMAIL: { type: 'string' },
					FIRST_NAME: { type: 'string', min: 2, max: 200 },
					LAST_NAME: { type: 'string', min: 2, max: 200 },
					PASSWORD: { type: 'string',  min: 6, pattern: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,20}$/ },
					ACCESS: {type: 'string'}
				},
				async handler(ctx) {
					try {
						const { NAME, EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, ACCESS} = ctx.params
						const userExists = await this.checkEmail(EMAIL);
						if (userExists) {
							return this.restAlreadyExistsResponse(EMAIL);
						}
						const nameExists = await this.checkCompany(NAME);
						if (nameExists){
							return this.restAlreadyExistsResponse(NAME);
						}
						const company = await this.insert("company", { NAME });
						const tableName = "user";
						const { SALT, HASH } = this.createPassword(PASSWORD);
						const user = {EMAIL, FIRST_NAME, LAST_NAME, ACCESS, COMPANY: company.ID,  SALT, HASH };
						const USER =  await this.insert(tableName, user);
						return{company, USER}
					} catch (error) {
						return Promise.reject(new Errors.MoleculerError(error.message, 400));
					}
				}
			},

			insertUser: {
				rest: 'POST /insertUser',
				auth: 'required',
				params: {
					FIRST_NAME: { type: 'string', min: 2, max: 200 },
					LAST_NAME: { type: 'string' , min: 2, max: 200},
					EMAIL: { type: 'string' , min: 2, max: 200},
					PASSWORD: {  type: 'string',  min: 6, pattern: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,20}$/ }
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const {
							FIRST_NAME,
							LAST_NAME,
							EMAIL,
							PASSWORD
						} = ctx.params;
						const userExists = await this.checkEmail(EMAIL);
						if (userExists) {
							return this.restAlreadyExistsResponse(EMAIL);
						}
						const COMPANY = ctx.meta.user.COMPANY;
						const { SALT, HASH } = this.createPassword(PASSWORD);
						const tableName = "user";
						const contact = await this.insert(tableName, {
							COMPANY,
							FIRST_NAME,
							LAST_NAME,
							EMAIL,
							SALT,
							HASH,
							ACCESS: "REGULAR_USER"
						});
						return this.restSuccessResponse("Team member successfully added", contact);
					}
					return this.AccessDenied("You do not have permission to add a team member")
				}
			},

			getCompanyTeam: {
				rest: 'GET /getCompanyTeam',
				auth: 'required',
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const data = await this.getTeam(ctx.meta.user.COMPANY);
						if (data) {
							return this.restSuccessResponse('Successfully fetched  team', data);
						}
						return this.restNotFoundResponse("Team")
					}
					return this.AccessDenied("You do not have permission to see members of team")
				},
			},

			updateUser: {
				rest: 'PUT updateUser/:id',
				auth: 'required',
				params: {
					ID: { type: 'string' },
					FIRST_NAME: { type: 'string' },
					LAST_NAME: { type: 'string' },
					EMAIL: { type: 'string' },
					PASSWORD: { type: 'string' }
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const {
							ID,
							FIRST_NAME,
							LAST_NAME,
							EMAIL,
							PASSWORD
						} = ctx.params;
						const tableName = 'user';
						const user = await this.findUserById(ID);
						console.log(user);
						if (!user) {
							return this.restNotFoundResponse('User');
						}
						const newUser = {
							...user,
							FIRST_NAME: FIRST_NAME ? FIRST_NAME : user.FIRST_NAME,
							LAST_NAME: LAST_NAME ? LAST_NAME : user.LAST_NAME,
							EMAIL: EMAIL ? EMAIL : user.EMAIL,
							PASSWORD: PASSWORD ? PASSWORD : user.PASSWORD,
						};
						console.log("new user")
						console.log(newUser);
						await this.updateByFields(tableName, newUser, { ID });
						const cleanedUser = this.cleanUser(newUser);
						return this.restSuccessResponse('Successfully updated user', { user: cleanedUser });
					}
					return this.AccessDenied("You do not have permission to update members")
				}
			},
		}
	}
};

