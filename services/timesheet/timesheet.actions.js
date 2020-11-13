
module.exports = function () {
	return {
		actions: {
			insertTimesheet: {
				rest: 'POST /insertTimesheet',
				auth: 'required',
				params: {
					TIME: {type : 'integer'},
					PROJECT: {type: 'string'},
					ROLE : {type : 'string'},
					NOTE : {type : 'string'},
					DATE : {type : 'date'}
				},
				async handler(ctx) {
					const { TIME, PROJECT, ROLE, NOTE, DATE } = ctx.params;
					const  USER = ctx.meta.user.ID
						const tableName = "timesheet";
						const timesheet = await this.insert(tableName,  {
							TIME,
							USER ,
							PROJECT,
							ROLE,
							NOTE, 
							DATE
						});
						return this.restSuccessResponse("Timesheet successfully added", timesheet);
				}
			},
			getTimesheetByDay: {
				rest: 'GET /getTimesheetByDay',
				auth: 'required',
				params: {
					DATE:  {type : "date"}
				},
				async handler(ctx) {
						const  USER = ctx.meta.user.ID;
						const {DATE} = ctx.params;
						const data = await this.getTimeSheet(DATE, USER) || [];
						return this.restSuccessResponse('Successfully fetched  timesheet', data);
					}
				},
		}
	};
};