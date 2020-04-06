import { getRepository } from "typeorm";
import { User } from "../entity/User";

class UserController {
	static async getOne({ id }) {

		// search for an entry with given id
		const user = await getRepository(User).findOne({
			select: ["id", "employeeId", "username", "userStatusId", "employeeCreatedId", "docreation", "description", "roleId"],
			relations: ["userStatus", "role", "employeeCreated", "employee"],
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
			const userFiltered = {
				id: user.id,
				username: user.username,
				employee: {
					number: user.employee.number
				},
				employeeCreated: {
					number: user.employeeCreated.number
				},
				role: {
					name: user.role.name
				},
				docreation: user.docreation,
				userStatus: {
					name: user.userStatus.name
				}
			}

			return {
				status: true,
				data: userFiltered
			};
		} else {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an user with that id."
			};
		}
	}

	static async getAll() {
		const users = await getRepository(User).find({
			select: ["id", "employeeId", "username", "userStatusId", "employeeCreatedId", "docreation", "description", "roleId"],
			relations: ["userStatus", "role", "employeeCreated", "employee"]
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// remove useless attributes
		const usersFiltered = users.map(user => {
			return {
				id: user.id,
				username: user.username,
				employee: {
					number: user.employee.number
				},
				employeeCreated: {
					number: user.employeeCreated.number
				},
				role: {
					name: user.role.name
				},
				docreation: user.docreation,
				userStatus: {
					name: user.userStatus.name
				}
			}
		});

		return {
			status: true,
			data: usersFiltered
		};
	}

	static async save(data) {
		// create user object
		const user = data as User;

		// save to db
		await getRepository(User).save(user).catch(e => {
			console.log(e.code, e);

			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "Entry with that user id already exists!."
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

	// static async update(data) {
	// 	// create user object
	// 	const editeduser = data as user;

	// 	// check if user is present with the given id
	// 	const selecteduser = await getRepository(user).findOne(editeduser.id).catch(e => {
	// 		console.log(e.code, e);
	// 		throw {
	// 			status: false,
	// 			type: "server",
	// 			msg: "Server Error!. Please check logs."
	// 		}
	// 	});

	// 	if (!selecteduser) {
	// 		throw {
	// 			status: false,
	// 			type: "input",
	// 			msg: "That user doesn't exist in our database!."
	// 		}
	// 	}

	// 	// check if photo has changed
	// 	if (data.photo == false) {
	// 		editeduser.photo = selecteduser.photo;
	// 	} else {
	// 		// read photo as buffer
	// 		const decodedBase64 = this.decodeBase64Image(editeduser.photo);
	// 		editeduser.photo = decodedBase64.data;
	// 	}

	// 	// update the user
	// 	await getRepository(user).save(editeduser).catch(e => {
	// 		console.log(e.code, e);
	// 		throw {
	// 			status: false,
	// 			type: "server",
	// 			msg: "Server Error!. Please check logs."
	// 		}
	// 	});

	// 	return {
	// 		status: true,
	// 		msg: "That user has been updated!"
	// 	};
	// }

	// static async delete({ id }) {
	// 	// find user with the given id
	// 	const user = await getRepository(user).findOne({ id: id }).catch(e => {
	// 		console.log(e.code, e);
	// 		throw {
	// 			status: false,
	// 			type: "server",
	// 			msg: "Server Error!. Please check logs."
	// 		}
	// 	});

	// 	if (!user) {
	// 		throw {
	// 			status: false,
	// 			type: "input",
	// 			msg: "That user doesn't exist in our database!."
	// 		}
	// 	}

	// 	// delete the user
	// 	await getRepository(user).delete(user).catch(e => {
	// 		console.log(e.code, e);
	// 		throw {
	// 			status: false,
	// 			type: "server",
	// 			msg: "Server Error!. Please check logs."
	// 		}
	// 	});

	// 	return {
	// 		status: true,
	// 		msg: "That user has been deleted!"
	// 	};
	// }
}

export default UserController;