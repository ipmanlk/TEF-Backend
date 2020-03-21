import { getManager, getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

class EmployeeController {
	static async getOne({ number }) {

		// search for an employee with given employee number
		const employee = await getRepository(Employee).find({
			number: number
		}).catch(e => {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// check if employee exists
		if (employee !== undefined) {
			return {
				status: true,
				data: employee
			};
		} else {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an employee with that employee number."
			};
		}


	}

	static async getAll() {
		// get all employees
		const employees = await getManager().find(Employee).catch(e => {
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		return {
			status: true,
			data: employees
		};
	}
}

export default EmployeeController;