import { getRepository } from "typeorm";

class GeneralController {
    static async get(data) {

        const table = data.table;

        // check if table name is given
        if (!table) {
            throw {
				status: false,
				type: "input",
				msg: "Please provide a valid table name."
			};
        }

        // find the table in general route info
        const routeData = require("./data/routeData.json");
        const generalRoute = routeData.GENERAL.find(rd => rd.table == table);

        if (!generalRoute) {
            throw {
				status: false,
				type: "input",
				msg: "That table name is not listed under general tables."
			};
        }

        const entries = await getRepository(generalRoute.table).find();

        return {
            status: true,
            data: entries
        }
    }
}

export default GeneralController;