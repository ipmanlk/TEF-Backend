import { getRepository } from "typeorm";
import { ProductPackage } from "../entity/ProductPackage";
import { Product } from "../entity/Product";
import { ProductionInventory } from "../entity/ProductionInventory";
import { ProductPackageStatus } from "../entity/ProductPackageStatus";
import { ProductPackageDao } from "../dao/ProductPackageDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { MiscUtil } from "../util/MiscUtil";
import { ProductPackageCostAnalysis } from "../entity/ProductPackageCostAnalysis";
import moment = require("moment");

export class ProductPackageController {
	static async get(data) {
		if (data !== undefined && data.id) {
			return this.getOne(data);
		} else {
			return this.search(data);
		}
	}

	private static async getOne({ id }) {
		try {
			// search for an entry with given id
			const entry = await getRepository(ProductPackage).findOne({
				where: { id: id },
				relations: ["product"],
			});

			// get production inventory pkg info
			const productionInventoryEntry = await getRepository(
				ProductionInventory
			).findOne({ where: { productPackageId: entry.id } });

			// add available qty to entry
			entry["availableQty"] = productionInventoryEntry
				? productionInventoryEntry.availableQty
				: 0;

			// get current sale price using product package cost analysis
			const productPkgCostAnalysis = await getRepository(
				ProductPackageCostAnalysis
			)
				.createQueryBuilder("p")
				.where("p.productPackageId = :id", { id: entry.id })
				.andWhere("p.validFrom <= :today AND p.validTo >= :today", {
					today: moment().format("YYYY-MM-DD"),
				})
				.getOne();

			if (productPkgCostAnalysis && productPkgCostAnalysis.salePrice) {
				entry.salePrice = productPkgCostAnalysis.salePrice;
			}

			// remove useless attributes
			entry["productCode"] = entry.product.code;
			delete entry.product;

			return {
				status: true,
				data: entry,
			};
		} catch (e) {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	private static async search(data = {}) {
		try {
			const entries = await ProductPackageDao.search(data);

			for (let entry of entries) {
				// get current sale price using product package cost analysis
				const productPkgCostAnalysis = await getRepository(
					ProductPackageCostAnalysis
				)
					.createQueryBuilder("p")
					.where("p.productPackageId = :id", { id: entry.id })
					.andWhere("p.validFrom <= :today AND p.validTo >= :today", {
						today: moment().format("YYYY-MM-DD"),
					})
					.getOne();

				if (productPkgCostAnalysis && productPkgCostAnalysis.salePrice) {
					entry.salePrice = productPkgCostAnalysis.salePrice;
				}
			}

			return {
				status: true,
				data: entries,
			};
		} catch (e) {
			console.log(e.code, e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	static async save(data) {
		// check if valid data is given
		await ValidationUtil.validate("PRODUCT_PACKAGE", data);

		// extract photo
		const { photo } = data;

		// parse data
		const productPkg = data as ProductPackage;

		// calculate photo size in kb
		if (photo.length > 689339) {
			throw {
				status: false,
				type: "input",
				msg: "Your photo should be smaller than 500KB.",
			};
		}

		// read photo as buffer
		const decodedBase64 = MiscUtil.decodeBase64Image(photo);
		productPkg.photo = decodedBase64.data;

		// generate product pkg code
		const lastEntry = await getRepository(ProductPackage).findOne({
			select: ["id", "code"],
			order: { id: "DESC" },
		});

		// set code for new product pkg
		if (lastEntry) {
			productPkg.code = MiscUtil.getNextNumber("PKG", lastEntry.code, 5);
		} else {
			productPkg.code = MiscUtil.getNextNumber("PKG", undefined, 5);
		}

		// save to db
		try {
			const newProductPkg = await getRepository(ProductPackage).save(
				productPkg
			);
			return {
				status: true,
				data: { code: newProductPkg.code },
				msg: "That product has been added!",
			};
		} catch (e) {
			console.log(e);

			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, productPkg);
				throw {
					status: false,
					type: "input",
					msg: msg,
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
		// check if product pkg is present with the given id
		const selectedProductPkg = await getRepository(ProductPackage)
			.findOne(data.id)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		if (!selectedProductPkg) {
			throw {
				status: false,
				type: "input",
				msg: "Product package with that id doesn't exist!.",
			};
		}

		// create product pkg object
		const editedProductPkg = data as ProductPackage;

		// check if photo has changed
		if (data.photo == false) {
			editedProductPkg.photo = selectedProductPkg.photo;
		} else {
			// calculate photo size in kb
			if (data.photo.length > 689339) {
				throw {
					status: false,
					type: "input",
					msg: "Your photo should be smaller than 500KB.",
				};
			}

			// read photo as buffer
			const decodedBase64 = MiscUtil.decodeBase64Image(data.photo);
			editedProductPkg.photo = decodedBase64.data;
		}

		// check if valid data is given
		await ValidationUtil.validate("PRODUCT_PACKAGE", editedProductPkg);

		try {
			await getRepository(ProductPackage).save(editedProductPkg);

			return {
				status: true,
				msg: "That product package has been updated!",
			};
		} catch (e) {
			if (e.code == "ER_DUP_ENTRY") {
				const msg = await this.getDuplicateErrorMsg(e, editedProductPkg);
				throw {
					status: false,
					type: "input",
					msg: msg,
				};
			}

			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	static async delete({ id }) {
		// find entry with the given id
		const entry = await getRepository(ProductPackage)
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
		const deletedStatus = await getRepository(ProductPackageStatus)
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
		entry.productPackageStatus = deletedStatus;

		await getRepository(ProductPackage)
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
			msg: "That product package has been deleted!",
		};
	}

	private static async getDuplicateErrorMsg(error, productPkg: ProductPackage) {
		// check if which unique field is violated
		let msg, field, duplicateEntry;

		if (error.sqlMessage.includes("code_UNIQUE")) {
			field = "code";
			msg = "Product package code already exists!";
		}

		// get duplicated entry
		duplicateEntry = await getRepository(ProductPackage)
			.findOne({
				select: ["id", "code"],
				where: { field: productPkg[field] },
			})
			.catch((e) => {
				console.log(e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		return `Product package (code: ${duplicateEntry.code}) with the same ${msg}`;
	}
}
