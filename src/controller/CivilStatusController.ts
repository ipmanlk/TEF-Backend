import { getManager } from "typeorm";
import { CivilStatus } from "../entity/CivilStatus";

class CivilStatusController {
    static async getAll() {
        const civilStatuses = await getManager().find(CivilStatus).catch(e => {
            console.log(e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: civilStatuses
		};
    }
}

export default CivilStatusController;