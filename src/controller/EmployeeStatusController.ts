import { getManager } from "typeorm";
import { EmployeeStatus } from "../entity/EmployeeStatus";

class EmployeeStatusController {
    static async getAll() {
        const employeeStatuses = await getManager().find(EmployeeStatus).catch(e => {
            console.log(e.code, e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: employeeStatuses
		};
    }
}

export default EmployeeStatusController;