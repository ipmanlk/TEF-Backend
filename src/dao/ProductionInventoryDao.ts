import { getRepository } from "typeorm";
import { ProductionInventory } from "../entity/ProductionInventory";
import { ProductionInventoryStatus } from "../entity/ProductionInventoryStatus";
import { ProductPackage } from "../entity/ProductPackage";

export class ProductionInventoryDao {
	static search({ keyword = "", skip = 0, limit = 15 }) {
		if (limit != 0) {
			return getRepository(ProductionInventory)
				.createQueryBuilder("po")
				.leftJoinAndSelect("po.productionInventoryStatus", "pis")
				.leftJoin("po.productPackage", "pkg")
				.addSelect(["pkg.id", "pkg.code", "pkg.name"])
				.where("pkg.name LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkg.code LIKE :keyword", { keyword: `%${keyword}%` })
				.skip(skip)
				.take(limit)
				.getMany();
		} else {
			return getRepository(ProductionInventory)
				.createQueryBuilder("po")
				.leftJoinAndSelect("po.productionInventoryStatus", "pis")
				.leftJoin("po.productPackage", "pkg")
				.addSelect(["pkg.id", "pkg.code", "pkg.name"])
				.getMany();
		}
	}

	static async updateInventoryStatuses() {
		// get all product packages
		const productPkgs = await getRepository(ProductPackage).find();
		const lowStatus = await getRepository(ProductionInventoryStatus).findOne({
			where: { name: "Low" },
		});

		const normalStatus = await getRepository(ProductionInventoryStatus).findOne(
			{
				where: { name: "Normal" },
			}
		);

		// update inventory statuses based on rop
		for (let pkg of productPkgs) {
			const inventoryProductPkg = await getRepository(
				ProductionInventory
			).findOne({ where: { productPackageId: pkg.id } });

			if (!inventoryProductPkg) continue;

			if (inventoryProductPkg.availableQty < pkg.rop) {
				// update status to low
				inventoryProductPkg.productionInventoryStatus = lowStatus;
			} else {
				inventoryProductPkg.productionInventoryStatus = normalStatus;
			}

			await getRepository(ProductionInventory).save(inventoryProductPkg);
		}
	}
}
