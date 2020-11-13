const { Errors } = require('moleculer');


module.exports = function () {
    return {
        methods: {
            async checkAccessAdmin(ACCESS) {
                if (ACCESS == "ADMIN") {
                    return true;
                }
                return false;
            },

            AccessDenied (message) {
				return Promise.reject(new Errors.MoleculerError(message, 422));
			},
        
        }
    }
}