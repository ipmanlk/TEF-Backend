import { ProductionInventory } from "../entity/ProductionInventory";
import { ProductionInventoryDao } from "../dao/ProductionInventoryDao";
import { getRepository } from "typeorm";
import { ProductionInventoryStatus } from "../entity/ProductionInventoryStatus";
import { ProductionInventoryUpdate } from "../entity/ProductionInventoryUpdate";
import * as moment from "moment";

export class ProductionInventoryController {
	static async get(data) {
		await ProductionInventoryDao.updateInventoryStatuses();
		return this.search(data);
	}

	static async save(data, session) {
		// get data
		const productPackageId = data.productPackageId;
		const qty = parseInt(data.qty);

		// check if this product package is present in the inventory
		const inventoryProductPackage = await getRepository(
			ProductionInventory
		).findOne({
			where: {
				productPackageId: productPackageId,
			},
		});

		// if exists in inventory
		if (inventoryProductPackage) {
			inventoryProductPackage.availableQty += qty;
			inventoryProductPackage.qty += qty;

			// update it
			await getRepository(ProductionInventory)
				.save(inventoryProductPackage)
				.catch((e) => {
					console.log(e.code, e);
					throw {
						status: false,
						type: "server",
						msg: "Server Error!. Please check logs.",
					};
				});

			// create entry for user update
			await this.addProductionInventoryUpdate(
				inventoryProductPackage.productPackageId,
				qty,
				session
			);

			return {
				status: true,
				msg: "Product packages has been added to the inventory!.",
			};
		} else {
			// create new inventory product package
			const inventoryProductPackage = new ProductionInventory();
			inventoryProductPackage.productPackageId = productPackageId;
			inventoryProductPackage.availableQty = qty;
			inventoryProductPackage.qty = qty;

			const normalStatus = await getRepository(
				ProductionInventoryStatus
			).findOne({
				where: {
					name: "Normal",
				},
			});

			if (!normalStatus) {
				throw {
					status: false,
					type: "server",
					msg: "Unable to find the 'Normal' status",
				};
			}

			inventoryProductPackage.productionInventoryStatus = normalStatus;

			// save it
			await getRepository(ProductionInventory)
				.save(inventoryProductPackage)
				.catch((e) => {
					console.log(e.code, e);
					throw {
						status: false,
						type: "server",
						msg: "Server Error!. Please check logs.",
					};
				});

			// create entry for user update
			await this.addProductionInventoryUpdate(
				inventoryProductPackage.productPackageId,
				qty,
				session
			);

			return {
				status: true,
				msg: "Product packages has been added to the inventory!.",
			};
		}
	}

	private static async addProductionInventoryUpdate(
		productPackageId,
		qty,
		session
	) {
		// update production inventory updates
		const productionInventoryUpdate = new ProductionInventoryUpdate();
		productionInventoryUpdate.employeeId = session.data.employeeId;
		productionInventoryUpdate.productPackageId = productPackageId;
		productionInventoryUpdate.qty = qty;
		productionInventoryUpdate.addedDate = moment().format("YYYY-MM-DD");

		await getRepository(ProductionInventoryUpdate)
			.save(productionInventoryUpdate)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});
	}

	// search entires in the db
	private static async search(data = {}) {
		const entries = await ProductionInventoryDao.search(data).catch((e) => {
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
}
