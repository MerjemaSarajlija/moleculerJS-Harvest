
module.exports = function () {
	return {
		actions: {
			insertClient: {
				rest: 'POST /insertClient',
				auth: 'required',
				params: {
					CLIENT: { type: 'string' },
					DESCRIPTION: { type: 'string' }
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
						const { CLIENT, DESCRIPTION } = ctx.params;
						const COMPANY_ID = ctx.meta.user.COMPANY;
						const tableName = "client";
						const client = await this.insert(tableName, { COMPANY_ID, CLIENT, DESCRIPTION });
						return this.restSuccessResponse("Client successfully added", client);
					}
					return this.AccessDenied("You do not have permission to add a client")
				}
			},
			
			getClients: {
				rest: 'GET /getClients',
				auth: 'required',
				params: {
					page: { type: 'number', integer: true, min: 1, optional: true, convert: true },
					pageSize: { type: 'number', integer: true, min: 0, optional: true, convert: true },
					sort: { type: 'string', optional: true },
				},
				async handler(ctx) {
					const company = ctx.meta.user.COMPANY;
					const data = await this.getClients(company, ctx.params) || [];
					return this.returnPaginatedList({
						message: 'List of all clients',
						items: data || [],
						page: this.settings.options.page,
						pageSize: this.settings.options.pageSize,
					});
				}
			},
			
			getClient: {
				rest: 'GET /getClient',
				auth: 'required',
				params: {
					ID: { type: 'string' }
				},
				async handler(ctx) {
					const { ID } = ctx.params;
					const client = await this.getClientById(ID);

					if (client) {
						return this.restSuccessResponse('Successfully fetched  clients and projects', client);
					}
					return this.restNotFoundResponse('Client');
				}
			},

			deleteClient: {
				rest: 'DELETE /deleteClient',
				auth: 'required',
				params: {
					ID: { type: 'string' }
				},
				async handler(ctx) {
					const { ID } = ctx.params;
					const client = await this.deleteClientById(ID);
					console.log(client);
					if (client) {
						return this.restSuccessResponse('Successfully deleted client', client);
					}
					return this.restNotFoundResponse('Client')
				}
			},

			getClientsAndProjects: {
				rest: 'GET /getClientsAndProjects',
				auth: 'required',
				async handler(ctx) {
					const company = ctx.meta.user.COMPANY;
					const data = await this.getClientsProjects(company) || [];
					if (data) {
						return this.restSuccessResponse('Successfully fetched  clients and projects', data);
					}
					return this.restNotFoundResponse('Client')
				}
			},

			updateClient: {
				rest: 'PUT updateClient',
				auth: 'required',
				params: {
					ID: { type: 'string' },
					COMPANY_ID: { type: 'string' },
					CLIENT: { type: 'string' },
					DESCRIPTION: { type: 'string' },
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);

					if (!checkingAccess) {
						return this.AccessDenied("You do not have permission to update clients")
					}
					const {
						ID,
						CLIENT,
						DESCRIPTION
					} = ctx.params;

					const tableName = 'client';
					const client = await this.getClientById(ID);
					if (!client) {
						return this.restNotFoundResponse('Client');
					}
					const newClient = {
						...client,
						CLIENT: CLIENT ? CLIENT : client.CLIENT,
						DESCRIPTION: DESCRIPTION ? DESCRIPTION : client.DESCRIPTION,
					};
					await this.updateByFields(tableName, newClient, { ID });
					const cleanedClient = this.cleanClient(newClient);
					return this.restSuccessResponse('Successfully updated user', { client: cleanedClient });
				}
			},
		}
	}

};