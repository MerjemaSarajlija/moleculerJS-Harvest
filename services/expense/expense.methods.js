
module.exports = function () {
    return {
        methods: {
            async getExpenses(project) {
                return await this.db("expense").where("PROJECT", project);
            },
        }
    };
};