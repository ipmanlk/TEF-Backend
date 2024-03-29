import { getRepository } from "typeorm";
import { ProductionOrder } from "../entity/ProductionOrder";

export class ProductionOrderDao {
	static search({ keyword = "", skip = 0 }) {
		return getRepository(ProductionOrder)
			.createQueryBuilder("po")
			.leftJoinAndSelect("po.productionOrderStatus", "pos")
			.where("po.code LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("po.requiredDate LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("pos.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orderBy("po.code", "DESC")
			.skip(skip)
			.take(15)
			.getMany();
	}

	static getOne(id) {
		return getRepository(ProductionOrder)
			.createQueryBuilder("po")
			.leftJoinAndSelect("po.productionOrderProductPackages", "popkg")
			.leftJoinAndSelect("po.productionOrderStatus", "pos")
			.leftJoin("po.employee", "emp")
			.leftJoin("po.confirmedEmployee2", "cemp")
			.addSelect([
				"emp.id",
				"emp.number",
				"emp.callingName",
				"cemp.id",
				"cemp.number",
				"cemp.callingName",
			])
			.leftJoin("popkg.productPackage", "pkg")
			.addSelect(["pkg.id", "pkg.code", "pkg.name"])
			.where("po.id = :productionOrderId", { productionOrderId: id })
			.getOne();
	}

	// get all production orders under a given status
	static getProductionOrdersByStatus(productionOrderStatusName = "") {
		return getRepository(ProductionOrder)
			.createQueryBuilder("po")
			.leftJoin("po.productionOrderStatus", "pos")
			.select(["po.id", "po.code"])
			.where("pos.name LIKE :statusName", {
				statusName: `%${productionOrderStatusName}%`,
			})
			.getMany();
	}
}
