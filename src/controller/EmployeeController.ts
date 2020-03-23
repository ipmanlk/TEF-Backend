import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";
import FileUtil from "../util/FileUtil";

class EmployeeController {
	static async getOne({ id }) {

		// search for an employee with given employee id
		const employee = await getRepository(Employee).findOne({
			id: id
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
		const employees = await getRepository(Employee).find({
			select: ["id", "number", "fullName", "callingName", "nic", "address", "mobile", "land", "doassignment", "genderId", "designationId", "civilStatusId", "employeeStatusId"],
			relations: ["gender", "designation", "civilStatus", "employeeStatus"]
		}).catch(e => {
			console.log(e);
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

	static async save(data) {
		// create employee object
		const employee = data as Employee;

		const { photo } = data;

		// check photo file size
		const photoSize = await FileUtil.getFileSize(photo.path, "KB").catch(e => {
			throw e;
		});

		if (photoSize > 500) {
			throw {
				status: false,
				type: "input",
				msg: "Your photo should be smaller than 500KB."
			}
		}

		// read photo as buffer
		employee.photo = await FileUtil.readFileAsBuffer(photo.path).catch(e => {
			throw e;
		});

		// save to db
		await getRepository(Employee).save(employee).catch(e => {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That employee has been added!"
		};
	}
}

export default EmployeeController;