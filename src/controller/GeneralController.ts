import { getRepository } from "typeorm";

export class GeneralController {
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

        const entries = await getRepository(table).find()
            .catch(() => {
                throw {
                    status: false,
                    type: "input",
                    msg: "That table name is not listed under general tables."
                };
            });

        return {
            status: true,
            data: entries
        }
    }
}