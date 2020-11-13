
module.exports = function () {
    return {
        actions: {
            insertExpense: {
				rest: 'POST /insertExpense',
				auth: 'required',
				params: {
                    DESCRIPTION: {type: 'string'},
                    AMOUNT: {type: 'float'},
                    PROJECT: {type: 'string'}
				},
				async handler(ctx) {
                    const {
                            DESCRIPTION,
                            AMOUNT,
                            PROJECT
                        } = ctx.params;
                        const USER = ctx.meta.user.ID;
                        const tableName = "expense";
						const expense = await this.insert(tableName,  {
                            USER: USER,
                            DESCRIPTION,
                            AMOUNT,
                            PROJECT
                        });
                        console.log(expense)
						return this.restSuccessResponse("Expense successfully added", expense);
				}
            },

            getAllExpenses: {
				rest: 'GET /getAllExpenses',
                auth: 'required',
                params: {
                   PROJECT: {type: 'string'}
				},
				async handler(ctx) {
					const checkingAccess = await this.checkAccessAdmin(ctx.meta.user.ACCESS);
					if (checkingAccess) {
                        const {PROJECT} = ctx.params;
                        const data = await this.getExpenses(PROJECT);
                        console.log("data")
                        console.log(data[0]);
                      if(data[0] == undefined) {  
                        return this.restNotFoundResponse('Expense')
                     }
                   return this.restSuccessResponse('Successfully fetched expense', data);
            		}
					return this.AccessDenied("You do not have permission to see members of team")
				},
			},
            
        
        }
    };
};