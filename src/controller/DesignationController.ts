import { getManager } from "typeorm";
import { Designation } from "../entity/Designation";

class DesignationController {
    static async getAll() {
        const designations = await getManager().find(Designation).catch(e => {
            console.log(e.code, e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: designations
		};
    }
}

export default DesignationController;