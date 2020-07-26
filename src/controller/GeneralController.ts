import { getRepository } from "typeorm";

export class GeneralController {
    static async get(data) {

        const generalTables = ["gender", "civil_status", "module", "user_status", "customer_status"];

        const table = data.table;

        // check if table name is given
        if (!table) {
            throw {
                status: false,
                type: "input",
                msg: "Please provide a valid table name."
            };
        }

        if (!generalTables.includes(table)) {
            throw {
                status: false,
                type: "input",
                msg: "That table name is not listed under general tables."
            };
        }

        const entries = await getRepository(table).find()
            .catch(() => {
                throw {
                    status: false,
                    type: "input",
                    msg: "There is no table under that name!."
                };
            });

        return {
            status: true,
            data: entries
        }
    }
}