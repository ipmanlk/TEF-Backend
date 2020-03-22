import * as  fs from "fs";
import { getManager, getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

class EmployeeController {
	static async getOne({ id }) {

		// search for an employee with given employee id
		const employee = await getRepository(Employee).find({
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
			select: ["id", "number", "fullName", "callingName", "dobirth", "nic", "address", "mobile", "land", "doassignment", "genderId", "designationId", "civilStatusId", "employeeStatusId"],
			relations: ["gender", "designation", "civilStatus", "employeeStatus"]
		}).catch(e => {
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
		const { photo } = data;
		let employee = data as Employee;
		let photoBuffer = await this.readAsBuffer(photo.path).catch(e => {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		employee.photo = (photoBuffer as Buffer);

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

	private static readAsBuffer = (path) => {
		return new Promise((resolve, reject) => {
			// Store file data chunks in this array
			let chunks = [];
			// We can use this variable to store the final data
			let fileBuffer;

			// Read file into stream.Readable
			let fileStream = fs.createReadStream(path);

			// An error occurred with the stream
			fileStream.once("error", (e) => {
				// Be sure to handle this properly!
				reject(e);
			});

			// File is done being read
			fileStream.once("end", () => {
				// create the final data Buffer from data chunks;
				fileBuffer = Buffer.concat(chunks);
				resolve(fileBuffer);
			});

			// Data is flushed from fileStream in chunks,
			// this callback will be executed for each chunk
			fileStream.on("data", (chunk) => {
				chunks.push(chunk); // push data chunk to array
			});

		});
	}
}

export default EmployeeController;