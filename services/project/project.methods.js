
module.exports = function () {
    return {
        methods: {

            async getProjectsByClient(client) {
                return await this.db("project").where("CLIENT_ID", client);
            },
        
        }
    };
};