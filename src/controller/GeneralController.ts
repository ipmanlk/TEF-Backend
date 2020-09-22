import { getRepository } from "typeorm";

export class GeneralController {
    static async get(data) {

        const generalTables = ["gender", "civil_status", "module", "user_status", "customer_status", "customer_type", "material_status", "material_type", "unit_type", "risk_category", "product_status", "product_category", "product_type", "product_package_status", "product_package_type", "supplier_status", "supplier_type", "quotation_request_status", "quotation_status", "purchase_order_status"];

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