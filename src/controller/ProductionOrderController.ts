import { getRepository } from "typeorm";
import { ProductionOrder } from "../entity/ProductionOrder";
import { ProductionOrderStatus } from "../entity/ProductionOrderStatus";
import { ProductionOrderDao } from "../dao/ProductionOrderDao";
import { MiscUtil } from "../util/MiscUtil";
import { ProductionOrderProductPackage } from "../entity/ProductionOrderProductPackage";
import { MaterialInventory } from "../entity/MaterialInventory";

export class ProductionOrderController {
	static async get(data) {
		if (data !== undefined && data.id) {
			return this.getOne(data);
		} else {
			return this.search(data);
		}
	}

	private static async getOne({ id }) {
		// search for an entry with given id
		const entry = await ProductionOrderDao.getOne(id).catch((e) => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		});

		// check if entry exists
		if (entry !== undefined) {
			// remove useless elements
			entry[
				"createdEmployee"
			] = `${entry.employee.callingName} (${entry.employee.number})`;
			delete entry.employee;

			if (entry.confirmedEmployee2) {
				entry[
					"confirmedBy"
				] = `${entry.confirmedEmployee2.callingName} (${entry.confirmedEmployee2.number})`;
				delete entry.confirmedEmployee2;
			} else {
				entry["confirmedBy"] = null;
				delete entry.confirmedEmployee2;
			}

			return {
				status: true,
				data: entry,
			};
		} else {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find an entry with that id.",
			};
		}
	}

	private static async search(data = {}) {
		const entries = await ProductionOrderDao.search(data).catch((e) => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		});

		return {
			status: true,
			data: entries,
		};
	}

	static async save(data, session) {
		// create purchase order code
		const lastEntry = await getRepository(ProductionOrder).findOne({
			select: ["id", "code"],
			order: { id: "DESC" },
		});

		if (lastEntry) {
			data.code = MiscUtil.getNextNumber("PRO", lastEntry.code, 5);
		} else {
			data.code = MiscUtil.getNextNumber("PRO", undefined, 5);
		}

		// create a production order object
		const productionOrder = data as ProductionOrder;

		// set created employee
		productionOrder.employeeId = session.data.employeeId;

		try {
			// save entry
			const entry = await getRepository(ProductionOrder).save(productionOrder);

			// set empty array for production order product packages
			const productionOrderProductPackages = [];

			data.productionOrderProductPackages.forEach((pkg) => {
				const productionOrderProductPackage = new ProductionOrderProductPackage();
				productionOrderProductPackage.productionOrderId = entry.id;
				productionOrderProductPackage.productPackageId = pkg.productPackageId;
				productionOrderProductPackage.qty = pkg.qty;
				productionOrderProductPackages.push(productionOrderProductPackage);
			});

			// save production order product packages
			await getRepository(ProductionOrderProductPackage).save(
				productionOrderProductPackages
			);

			// send success response
			return {
				status: true,
				data: { code: entry.code },
				msg: "Production order has been created!",
			};
		} catch (e) {
			console.log(e.code, e);

			if (e.code == "ER_DUP_ENTRY") {
				throw {
					status: false,
					type: "input",
					msg: "Purchase order already exists for the given quotation!.",
				};
			}

			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	static async update(data) {
		// check if an entry is present with given id
		const selectedEntry = await getRepository(ProductionOrder)
			.findOne(data.id)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		if (!selectedEntry) {
			throw {
				status: false,
				type: "input",
				msg: "That entry doesn't exist in our database!.",
			};
		}

		const editedEntry = data as ProductionOrder;

		try {
			// remove existing production order product packages
			await getRepository(ProductionOrderProductPackage)
				.createQueryBuilder()
				.delete()
				.where("productionOrderId = :id", { id: editedEntry.id })
				.execute();

			// update production order
			await getRepository(ProductionOrder).save(editedEntry);

			// set empty array for production order product packages
			const productionOrderProductPackages = [];

			data.productionOrderProductPackages.forEach((pkg) => {
				const productionOrderProductPackage = new ProductionOrderProductPackage();
				productionOrderProductPackage.productionOrderId = editedEntry.id;
				productionOrderProductPackage.productPackageId = pkg.productPackageId;
				productionOrderProductPackage.qty = pkg.qty;
				productionOrderProductPackages.push(productionOrderProductPackage);
			});

			// save production order product packages
			await getRepository(ProductionOrderProductPackage).save(
				productionOrderProductPackages
			);
		} catch (e) {
			console.log(e.code, e);
			throw e;
		}

		return {
			status: true,
			msg: "Production order has been updated!.",
		};
	}

	static async delete({ id }) {
		// find entry with the given id
		const entry = await getRepository(ProductionOrder)
			.findOne({ id: id })
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		if (!entry) {
			throw {
				status: false,
				type: "input",
				msg: "That entry doesn't exist in our database!.",
			};
		}

		// find deleted status
		const deletedStatus = await getRepository(ProductionOrderStatus)
			.findOne({ name: "Deleted" })
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		// if there is no status called deleted
		if (!deletedStatus) {
			throw {
				status: false,
				type: "server",
				msg: "Deleted status doesn't exist in the database!.",
			};
		}

		// set status to delete
		entry.productionOrderStatus = deletedStatus;

		await getRepository(ProductionOrder)
			.save(entry)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		return {
			status: true,
			msg: "That production order has been deleted!.",
		};
	}

	// used to confirmation and rejection
	static async confirmOrder(data, session) {
		// check if an entry is present with given id
		const selectedEntry = await getRepository(ProductionOrder)
			.findOne({
				where: { id: data.id },
			})
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		if (!selectedEntry) {
			throw {
				status: false,
				type: "input",
				msg: "That entry doesn't exist in our database!.",
			};
		}

		selectedEntry.confirmedEmployee = session.data.employeeId;
		selectedEntry.confirmedDate = data.confirmedDate;

		// change status
		const confirmedStatus = await getRepository(ProductionOrderStatus)
			.findOne({ name: data.statusName })
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		selectedEntry.productionOrderStatus = confirmedStatus;

		await getRepository(ProductionOrder)
			.save(selectedEntry)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		// update material inventory if order is confirmed
		if (confirmedStatus.name == "Confirmed") {
			for (let material of data.materials) {
				// find material on material inventory
				const inventoryMaterial = await getRepository(
					MaterialInventory
				).findOne({
					where: { id: material.id },
				});

				// update qty
				const availableQty = inventoryMaterial.availableQty;
				inventoryMaterial.availableQty = (
					parseFloat(availableQty) - parseFloat(material.requiredAmount)
				).toFixed(2);

				// save
				await getRepository(MaterialInventory).save(inventoryMaterial);
			}
		}

		return {
			status: true,
			msg: `Production order has been ${confirmedStatus.name.toLowerCase()}`,
		};
	}

	static async getProductionOrdersByStatus(data) {
		const productionOrders = await ProductionOrderDao.getProductionOrdersByStatus(
			data.productionOrderStatusName
		).catch((e) => {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		});

		return {
			data: productionOrders,
			status: true,
		};
	}
}
