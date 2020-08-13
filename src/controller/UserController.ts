require("dotenv").config();

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRole } from "../entity/UserRole";
import { UserStatus } from "../entity/UserStatus";
import { UserDao } from "../dao/UserDao";
import { Employee } from "../entity/Employee";
import { createHash } from "crypto";
import { ValidationUtil } from "../util/ValidationUtil";

export class UserController {
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
			select: ["id", "employeeId", "username", "userStatusId", "addedDate", "description"],
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
			user["number"] = user.employee.number;
			delete user.employee;

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
		// check if valid data is given
		await ValidationUtil.validate("USER", data);

		// create user object
		const user = data as User;

		// check employee id exists with given employee number
		const employee = await getRepository(Employee).findOne({
			number: data.number
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
		
		user.employeeId = employee.id;

		// hash the password
		const hashedPass = createHash("sha512").update(`${user.password}${process.env.SALT}`).digest("hex");

		// update user obj
		user.password = hashedPass;

		// TODO: get created emppoyee id from session
		if (process.env.PRODUCTION == "false") {
			user.employeeCreatedId = 1;
		} else {
			user.employeeCreatedId = session.data.employeeId;
		}


		// set date of creation
		user.addedDate = new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];

		// save to db
		const newUser = await getRepository(User).save(user).catch(e => {
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

		// set roles for new user
		const userRoles = data.roleIds.map(rid => {
			return { userId: newUser.id, roleId: rid }
		});

		await getRepository(UserRole).save(userRoles).catch(e => {
			console.log(e.code, e);
			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "User roles already exists!."
				}
			}
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs. (Role adding)"
			}
		});


		return {
			status: true,
			msg: "That user has been added!"
		};
	}

	static async update(data) {
		// create user object
		const editedUser = data as User;

		// check if valid data is given
		await ValidationUtil.validate("USER", editedUser);

		// check if user is present with the given id
		const selectedUser = await getRepository(User).findOne(editedUser.id).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!selectedUser) {
			throw {
				status: false,
				type: "input",
				msg: "That user doesn't exist in our database!."
			}
		}

		// check employee id exists with given employee number
		const employee = await getRepository(Employee).findOne({
			number: data.number
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

		editedUser.employeeId = employee.id;

		// hash the password
		const hashedPass = createHash("sha512").update(`${editedUser.password}${process.env.SALT}`).digest("hex");

		// update user obj
		editedUser.password = hashedPass;

		// update the user
		await getRepository(User).save(editedUser).catch(e => {
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

		// update roles
		const currentRoles = await getRepository(UserRole).find({
			where: { userId: editedUser.id }
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		// clear current roles
		for (let ur of currentRoles) {
			await getRepository(UserRole).delete(ur).catch(e => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs."
				}
			});
		}

		// update roles
		const userRoles = data.roleIds.map(rid => {
			return { userId: editedUser.id, roleId: rid }
		});

		await getRepository(UserRole).save(userRoles).catch(e => {
			console.log(e.code, e);
			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "User roles already exists!."
				}
			}
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs. (Role adding)"
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

		// find deleted status
		const deletedStatus = await getRepository(UserStatus).findOne({ name: "Deleted" }).catch(e => {
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

		// set user status to deleted
		user.userStatus = deletedStatus;

		await getRepository(User).save(user).catch(e => {
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