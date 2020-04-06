import { getManager } from "typeorm";
import { Role } from "../entity/Role";

class RoleController {
    static async getAll() {
        const roles = await getManager().find(Role).catch(e => {
            console.log(e.code, e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: roles
		};
    }
}

export default RoleController;