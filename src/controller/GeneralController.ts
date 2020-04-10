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

        if (!routeData["GENERAL TABLES"].includes(table)) {
            throw {
				status: false,
				type: "input",
				msg: "That table name is not listed under general tables."
			};
        }

        const entries = await getRepository(table).find();

        return {
            status: true,
            data: entries
        }
    }
}

export default GeneralController;