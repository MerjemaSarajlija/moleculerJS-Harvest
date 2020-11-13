module.exports = function () {
    return {
        methods: {
            async getTimeSheet(date, userID) {
				const queryStr = `SELECT * FROM timesheet  RIGHT JOIN project ON timesheet.project = project.ID WHERE DATE = "${date}" AND USER = "${userID}"`;
                const result = await this.db.raw(queryStr);
				if (result[0].length) {
                    var data = JSON.stringify(result[0])
                    res = JSON.parse(data);
                      return res;
                }
				return null;
            },
        }
    };
};