
module.exports = function () {
	return {
		actions: {
			insertContact: {
				rest: 'POST /insertContact',
				auth: 'required',
				params: {
					CLIENT_ID: { type: 'string' },
					FIRST_NAME: { type: 'string' },
					SECOND_NAME: { type: 'string' },
					EMAIL: { type: 'string' },
					PHONE_OFFICE: { type: 'string' },
					PHONE_MOBILE: { type: 'string' },
					FAX: { type: 'string' },
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const {
							CLIENT_ID,
							FIRST_NAME,
							SECOND_NAME,
							EMAIL,
							PHONE_OFFICE,
							PHONE_MOBILE,
							FAX,
						} = ctx.params;
						const tableName = "contact";
						const contact = await this.insert(tableName,  {
							CLIENT_ID,
							FIRST_NAME,
							SECOND_NAME,
							EMAIL,
							PHONE_OFFICE,
							PHONE_MOBILE,
							FAX,
						});
						return this.restSuccessResponse("Contact successfully added", contact);
					}
					return this.AccessDenied("You do not have permission to add a client")
				}
			},
		}
	};
};