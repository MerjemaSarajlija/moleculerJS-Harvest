module.exports = function () {
    return {
        methods: {
            async getClients(company, params) {
                 this.settings.options = this.getOptionsFromParams(params);
                 let queryStr =  this.db("client").where("COMPANY_ID", company).orderBy('CLIENT', this.settings.options.order);
               //  let countStr =  this.db('client').count({count: '*'});
                 let restOfQuery = '';
                 queryStr = queryStr + restOfQuery + this.orderStr() + ' ';
                 queryStr += this.pagesStr();
                 const result = await this.db.raw(queryStr);
                 const count = await this.db.raw(countStr);
               //  console.log(countStr);
              return result[0] 
                /*  this.settings.options = this.getOptionsFromParams(params);
                console.log(this.settings.options);

                //let queryStr = `SELECT * FROM client WHERE COMPANY_ID = "${company}" ORDER BY CLIENT ${this.settings.options.order}`;
                //let countStr = `SELECT COUNT(*) FROM client  WHERE COMPANY_ID = "${company}"`;

                let queryStr = `SELECT * FROM client WHERE COMPANY_ID = ? ORDER BY CLIENT ${this.settings.options.order}`;
                let countStr = `SELECT COUNT(*) FROM client  WHERE COMPANY_ID = ?`;

                let restOfQuery = '';
                queryStr = queryStr + restOfQuery + this.orderStr() + ' ';
                queryStr += this.pagesStr();
                const result = await this.db.raw(queryStr, [ company ]);
                const counter = await this.db.raw(countStr, [ company ]);
                if (result[0].length) {
                   var data = JSON.stringify(result[0])
                    res = JSON.parse(data);
                    var dataCount = JSON.stringify(counter[0]);
                    console.log("dataCount")
                    count =JSON.parse(dataCount)
                    return{ res, count }
                }
               return;*/
            },
            
            async getClientById(ID) {
                return await this.db("client").where("ID", ID).first();
            },
           
            async deleteClientById(ID) {
                return await this.db('client').where('ID', ID).del();
            },

            cleanClient(clientObject) {
				return {
					...clientObject,
					CLIENT: clientObject.CLIENT,
					DESCRIPTION: clientObject.DESCRIPTION
				};
			},

            async getClientsProjects(company) {
                const queryStr = `SELECT client.*, GROUP_CONCAT(project.NAME) AS PROJECTS FROM client RIGHT JOIN project ON client.ID = project.CLIENT_ID WHERE COMPANY_ID = "${company}" GROUP BY client.ID`;
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
