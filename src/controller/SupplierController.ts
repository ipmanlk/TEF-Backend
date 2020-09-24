import { getRepository } from "typeorm";
import { Supplier } from "../entity/Supplier";
import { SupplierDao } from "../dao/SupplierDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { SupplierStatus } from "../entity/SupplierStatus";
import { MiscUtil } from "../util/MiscUtil";

export class SupplierController {
	static async get(data) {
		if (data !== undefined && data.id) {
			return this.getOne(data);
		} else {
			return this.search(data);
		}
	}

	private static async getOne({ id }) {
		// search for supplier with given id
		const supplier = await getRepository(Supplier).findOne({
			where: { id: id },
			relations: ["employee"]
		}).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
		});

		// check if supplier exists
		if (supplier !== undefined) {
			// remove useless elements
			supplier["createdEmployee"] = `${supplier.employee.callingName} (${supplier.employee.number})`;
			delete supplier.employee;

			return {
				status: true,
				data: supplier
			};
		} else {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find a supplier with that supplier id."
			};
		}
	}

	private static async search(data = {}) {
		const suppliers = await SupplierDao.search(data).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			data: suppliers
		};
	}

	static async save(data, session) {
		// check if valid data is given
		await ValidationUtil.validate("SUPPLIER", data);

		// add employee id of the current session as created employee
		data.employeeId = session.data.employeeId;

		// generate supplier code
		let lastSupplier = await getRepository(Supplier).findOne({
			select: ["id", "code"],
			order: { id: "DESC" }
		});

		// set number for new supplier
		if (lastSupplier) {
			data.code = MiscUtil.getNextNumber("SUP", lastSupplier.code, 4);
		} else {
			data.code = MiscUtil.getNextNumber("SUP", undefined, 4);
		}

		try {
			const newSupplier = await getRepository(Supplier).save(data);

			return {
				status: true,
				data: { code: newSupplier.code },
				msg: "That supplier has been added!"
			};

		} catch (e) {
			console.log(e.code, e);

			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, data as Supplier)

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
		// create supplier object
		const editedSupplier = data as Supplier;

		// check if valid data is given
		await ValidationUtil.validate("SUPPLIER", editedSupplier);

		// check if supplier is present with the given id
		const selectedSupplier = await getRepository(Supplier).findOne(editedSupplier.id).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!selectedSupplier) {
			throw {
				status: false,
				type: "input",
				msg: "That supplier doesn't exist in our database!."
			}
		}

		// update the supplier
		try {
			await getRepository(Supplier).save(editedSupplier);
			return {
				status: true,
				msg: "That supplier has been updated!"
			};

		} catch (e) {
			console.log(e.code, e);

			// check for duplicate entry
			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, editedSupplier);

				throw {
					status: false,
					type: "input",
					msg: msg
				}
			}

			// server error handling
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		}
	}

	static async delete({ id }) {
		// find supplier with the given id
		const supplier = await getRepository(Supplier).findOne({ id: id }).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		if (!supplier) {
			throw {
				status: false,
				type: "input",
				msg: "That supplier doesn't exist in our database!."
			}
		}


		// find deleted status
		const deletedStatus = await getRepository(SupplierStatus).findOne({ name: "Deleted" }).catch(e => {
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

		// delete the supplier
		supplier.supplierStatus = deletedStatus;

		await getRepository(Supplier).save(supplier).catch(e => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return {
			status: true,
			msg: "That supplier has been deleted!"
		};
	}

	private static async getDuplicateErrorMsg(error, supplier: Supplier) {
		// check if which unique field is violated
		let msg, field, duplicateEntry;

		if (error.sqlMessage.includes("nic_UNIQUE")) {
			field = "nic";
			msg = "NIC already exists!"

		} else if (error.sqlMessage.includes("person_mobile_UNIQUE")) {
			field = "personMobile";
			msg = "contact number already exists!"

		} else if (error.sqlMessage.includes("email_UNIQUE")) {
			field = "email";
			msg = "email already exists!"

		} else if (error.sqlMessage.includes("company_mobile_UNIQUE")) {
			field = "companyMobile";
			msg = "company contact number already exists!"

		} else if (error.sqlMessage.includes("reg_number_UNIQUE")) {
			field = "regNumber";
			msg = "company registration number already exists!"

		} else {
			return "Supplier with same information already exists!";
		}

		// get duplicated entry
		duplicateEntry = await getRepository(Supplier).findOne({
			select: ["id", "code"],
			where: { field: supplier[field] }
		}).catch(e => {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
		});

		return `Supplier (Code: ${duplicateEntry.code}) with the same ${msg}`;
	}
}