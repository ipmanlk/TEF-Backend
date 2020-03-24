import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

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

		// extract photo
		const { photo } = data;

		// calculate photo size in kb
		const photoSize = photo.length / 999;

		if (photoSize > 500) {
			throw {
				status: false,
				type: "input",
				msg: "Your photo should be smaller than 500KB."
			}
		}
		
		// read photo as buffer
		const decodedBase64 = this.decodeBase64Image(photo);
		employee.photo = decodedBase64.data;

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

	static decodeBase64Image(dataString) {
		const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
		const decodedBase64 = {} as any;

		if (matches.length !== 3) {
			throw {
				status: false,
				type: "input",
				msg: "Please select a valid image!."
			}
		}

		decodedBase64.type = matches[1];
		decodedBase64.data = Buffer.from(matches[2], "base64");

		return decodedBase64;
	}
}

export default EmployeeController;