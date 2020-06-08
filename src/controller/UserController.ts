require("dotenv").config();

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserDao } from "../dao/UserDao";
import { Employee } from "../entity/Employee";
import { createHash } from "crypto";

class UserController {
	static async get(data) {
		if (data !== undefined && data.id) {			
			return this.getOne(data);
		} else {
			return this.search(data);
		}
	}

	private static async getOne({ id }) {
		// search for an entry with given id
		const user = await getRepository(User).findOne({
			select: ["id", "employeeId", "username", "userStatusId", "docreation", "description"],
			relations: ["employee", "userRoles"],
			where: { id: id }
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// check if entry exists
		if (user !== undefined) {
			// remove useless attributes
			user.employee = {
				id: user.employee.id,
				number: user.employee.number
			} as any;

			return {
				status: true,
				data: user
			};
		} else {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an user with that id."
			};
		}
	}

	private static async search(data = {}) {		
		const users = await UserDao.search(data).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			data: users
		};
	}

	static async save(data, session) {
		// create user object
		const user = data as User;

		// check employee id exists with given employee number
		const employee = await getRepository(Employee).findOne({
			number: data.employee.number
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// if employee is not found
		if (employee == undefined) {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an employee with that number!"
			};
		}		

		delete user.employee;
		user.employeeId = employee.id;
		
		// hash the password
		const hashedPass = createHash("sha512").update(`${user.password}${process.env.SALT}`).digest("hex");

		// update user obj
		user.password = hashedPass;

		// TODO: get created emppoyee id from session
		if (process.env.PRODUCTION == "false") {
			user.employeeCreatedId = 1;
		} else {
			user.employeeCreatedId = session.user.employeeCreatedId;
		}


		// set date of creation
		user.docreation = new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];

		// save to db
		await getRepository(User).save(user).catch(e => {
			console.log(e.code, e);

			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "Entry already exists!."
				}
			}
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That user has been added!"
		};
	}

	static async update(data) {
		// create user object
		const editeduser = data as User;

		// check if user is present with the given id
		const selecteduser = await getRepository(User).findOne(editeduser.id).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!selecteduser) {
			throw {
				status: false,
				type: "input",
				msg: "That user doesn't exist in our database!."
			}
		}

		// check employee id exists with given employee number
		const employee = await getRepository(Employee).findOne({
			number: data.employee.number
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// if employee is not found
		if (employee == undefined) {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an employee with that number!"
			};
		}

		editeduser.employeeId = employee.id;

		// hash the password
		const hashedPass = createHash("sha512").update(`${editeduser.password}${process.env.SALT}`).digest("hex");

		// update user obj
		editeduser.password = hashedPass;
		
		// update the user
		await getRepository(User).save(editeduser).catch(e => {
			console.log(e.code, e);
			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "Entry already exists!."
				}
			}
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That user has been updated!"
		};
	}

	static async delete({ id }) {
		// find user with the given id
		const user = await getRepository(User).findOne({ id: id }).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!user) {
			throw {
				status: false,
				type: "input",
				msg: "That user doesn't exist in our database!."
			}
		}

		// delete the user
		await getRepository(User).delete(user).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That user has been deleted!"
		};
	}
}

export default UserController;