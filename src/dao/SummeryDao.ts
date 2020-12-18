import { getRepository } from "typeorm";
import * as moment from "moment";
import { MaterialInventory } from "../entity/MaterialInventory";
import { ProductionInventory } from "../entity/ProductionInventory";
import { CustomerOrder } from "../entity/CustomerOrder";
import { CustomerInvoice } from "../entity/CustomerInvoice";
import { MaterialInventoryDao } from "../dao/MaterialInventoryDao";
import { ProductPackageDao } from "../dao/ProductPackageDao";
import { ProductionOrder } from "../entity/ProductionOrder";
import { ProductionInventoryDao } from "./ProductionInventoryDao";

export class SummeryDao {
	private static readonly today = moment().format("YYYY-MM-DD");
	private static readonly prevYearStart = moment()
		.subtract(1, "years")
		.startOf("year")
		.format("YYYY-MM-DD");
	private static readonly nextYearEnd = moment()
		.add(1, "years")
		.endOf("year")
		.format("YYYY-MM-DD");

	static async getLowMaterials() {
		await MaterialInventoryDao.updateInventoryStatuses();
		return getRepository(MaterialInventory)
			.createQueryBuilder("mi")
			.leftJoin("mi.material", "m")
			.leftJoin("mi.materialInventoryStatus", "mis")
			.select(["mi.id", "m.id", "m.name", "m.code", "mi.availableQty"])
			.where("mis.name = :status", { status: "Low" })
			.getMany();
	}

	static async getLowProductPkgs() {
		await ProductionInventoryDao.updateInventoryStatuses();
		return getRepository(ProductionInventory)
			.createQueryBuilder("pi")
			.leftJoin("pi.productPackage", "p")
			.leftJoin("pi.productionInventoryStatus", "pis")
			.select(["pi.id", "p.id", "p.code", "p.name", "pi.availableQty"])
			.where("pis.name = :status", { status: "Low" })
			.getMany();
	}

	static async getCustomerOrders() {
		return getRepository(CustomerOrder)
			.createQueryBuilder("co")
			.leftJoin("co.customer", "c")
			.leftJoin("co.customerOrderStatus", "cos")
			.select([
				"co.id",
				"co.cocode",
				"co.requiredDate",
				"co.addedDate",
				"c.id",
				"c.number",
				"c.customerName",
			])
			.where("co.requiredDate >= :start AND co.requiredDate <= :end", {
				start: this.prevYearStart,
				end: this.nextYearEnd,
			})
			.andWhere("cos.name = :status", { status: "Active" })
			.getMany();
	}

	static async getCheques() {
		return getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.leftJoin("ci.customerPaymentMethod", "pm")
			.select([
				"ci.id",
				"ci.code",
				"ci.chequeNo",
				"ci.chequeDate",
				"ci.addedDate",
			])
			.where("ci.chequeDate >= :start AND ci.chequeDate <= :end", {
				start: this.prevYearStart,
				end: this.nextYearEnd,
			})
			.andWhere("pm.name = :method", { method: "Cheque" })
			.getMany();
	}

	static async getProductionOrders() {
		return getRepository(ProductionOrder)
			.createQueryBuilder("po")
			.leftJoin("po.productionOrderStatus", "pos")
			.leftJoin("po.employee", "emp")
			.select([
				"po.id",
				"po.code",
				"po.requiredDate",
				"po.requiredDate",
				"po.addedDate",
				"emp.id",
				"emp.callingName",
				"emp.number",
			])
			.where("po.requiredDate >= :start AND po.requiredDate <= :end", {
				start: this.prevYearStart,
				end: this.nextYearEnd,
			})
			.andWhere("pos.name = :pending OR pos.name = :confirmed", {
				pending: "Pending",
				confirmed: "Confirmed",
			})
			.getMany();
	}
}
