module.exports = function () {
	return {
		actions: {
			insertProject: {
				rest: 'POST /insertProject',
				auth: 'required',
				params: {
					CLIENT_ID: { type: 'number' },
					NAME: { type: 'string' }
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const { CLIENT_ID, NAME } = ctx.params;
						const tableName = "project";
						const project = await this.insert(tableName, { CLIENT_ID, NAME });
						return this.restSuccessResponse("Project successfully added", project);
					}
					return this.AccessDenied("You do not have permission to add a project")
				}
			},

			getCompanyProjects: {
				rest: 'GET /getCompanyProjects',
				auth: 'required',
				params: {
					CLIENT_ID : {type : 'string'}
				},
				async handler(ctx) {
					    console.log(ctx.params);
					    const {CLIENT_ID} = ctx.params;
						const data = await this.getProjectsByClient(CLIENT_ID);
						if(data[0] == undefined) {  
							return this.restNotFoundResponse('Project')
						 }
						return this.restSuccessResponse('Successfully fetched  projects', data);
				},
			},

		}
	};
};