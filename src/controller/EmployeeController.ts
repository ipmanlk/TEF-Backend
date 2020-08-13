import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";
import { EmployeeStatus } from "../entity/EmployeeStatus";
import { EmployeeDao } from "../dao/EmployeeDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class EmployeeController {
	static async get(data) {
		if (data !== undefined && data.id) {
			return this.getOne(data);
		} else {
			return this.search(data);
		}
	}

	private static async getOne({ id }) {

		// search for an employee with given employee id
		const employee = await getRepository(Employee).findOne({
			id: id
		}).catch(e => {
			console.log(e.code, e);
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

	private static async search(data = {}) {
		const employees = await EmployeeDao.search(data).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			data: employees
		};
	}

	static async save(data) {
		// check if valid data is given
		await ValidationUtil.validate("EMPLOYEE", data);

		// create employee object
		const employee = data as Employee;

		// extract photo
		const { photo } = data;


		// calculate photo size in kb
		if (photo.length > 689339) {
			throw {
				status: false,
				type: "input",
				msg: "Your photo should be smaller than 500KB."
			}
		}

		// read photo as buffer
		const decodedBase64 = this.decodeBase64Image(photo);
		employee.photo = decodedBase64.data;

		// generate employee number
		const lastEmployee = await getRepository(Employee).findOne({
			select: ["id", "number"],
			order: { id: "DESC" }
		});

		const lastEmployeeYear = parseInt(lastEmployee.number.substring(3, 7));
		const lastEmployeeNumber = parseInt(lastEmployee.number.substring(7));
		const currentYear = new Date().getFullYear();

		let newEmployeeNumber;

		// conver to 4 digit
		function padToFour(number) {
			if (number <= 9999) { number = ("000" + number).slice(-4); }
			return number;
		}

		// check to set employee number back to 0000 when new year arrives
		if (currentYear == lastEmployeeYear + 1) {
			newEmployeeNumber = `EMP${currentYear}0000`;
		} else {
			newEmployeeNumber = `EMP${currentYear}${padToFour(lastEmployeeNumber + 1)}`;
		}

		employee.number = newEmployeeNumber;


		// save to db
		try {
			const newEmployee = await getRepository(Employee).save(employee);
			return {
				status: true,
				data: { number: newEmployee.number },
				msg: "That employee has been added!"
			}
		} catch (e) {
			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, employee)
				throw {
					status: false,
					type: "input",
					msg: msg
				}
			}

			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		}
	}

	static async update(data) {
		// create employee object
		const editedEmployee = data as Employee;

		// check if employee is present with the given id
		const selectedEmployee = await getRepository(Employee).findOne(editedEmployee.id).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!selectedEmployee) {
			throw {
				status: false,
				type: "input",
				msg: "That employee doesn't exist in our database!."
			}
		}

		// check if photo has changed
		if (data.photo == false) {
			editedEmployee.photo = selectedEmployee.photo;
		} else {

			// calculate photo size in kb
			if (editedEmployee.photo.length > 689339) {
				throw {
					status: false,
					type: "input",
					msg: "Your photo should be smaller than 500KB."
				}
			}

			// read photo as buffer
			const decodedBase64 = this.decodeBase64Image(editedEmployee.photo);
			editedEmployee.photo = decodedBase64.data;
		}

		// check if valid data is given
		await ValidationUtil.validate("EMPLOYEE", editedEmployee);


		try {
			await getRepository(Employee).save(editedEmployee);

			return {
				status: true,
				msg: "That employee has been updated!"
			}
			
		} catch (e) {
			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, editedEmployee)
				throw {
					status: false,
					type: "input",
					msg: msg
				}
			}

			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		}
	}

	static async delete({ id }) {
		// find employee with the given id
		const employee = await getRepository(Employee).findOne({ id: id }).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!employee) {
			throw {
				status: false,
				type: "input",
				msg: "That employee doesn't exist in our database!."
			}
		}


		// find deleted status
		const deletedStatus = await getRepository(EmployeeStatus).findOne({ name: "Deleted" }).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		// if there is no status called deleted
		if (!deletedStatus) {
			throw {
				status: false,
				type: "server",
				msg: "Deleted status doesn't exist in the database!."
			}
		}

		// delete the employee (make inactive)
		employee.employeeStatus = deletedStatus;

		await getRepository(Employee).save(employee).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That employee has been deleted!"
		};
	}

	private static decodeBase64Image(dataString) {
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

	private static async getDuplicateErrorMsg(error, employee: Employee) {
		// check if which unique field is violated
		let msg, field, duplicateEntry;

		if (error.sqlMessage.includes("nic_UNIQUE")) {
			field = "nic";
			msg = "NIC already exists!"

		} else if (error.sqlMessage.includes("mobile_UNIQUE")) {
			field = "cmobile";
			msg = "mobile number already exists!"

		} else if (error.sqlMessage.includes("land_UNIQUE")) {
			field = "email";
			msg = "land number already exists!"

		} else {
			return "Customer with same information already exists!";
		}

		// get duplicated entry
		duplicateEntry = await getRepository(Employee).findOne({
			select: ["id", "number"],
			where: { field: employee[field] }
		}).catch(e => {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return `Employee (Number: ${duplicateEntry.number}) with the same ${msg}`;
	}
}