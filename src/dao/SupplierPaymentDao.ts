import { getRepository } from "typeorm";
import { SupplierPayment } from "../entity/SupplierPayment";

export class SupplierPaymentDao {
	static search({ keyword = "", skip = 0 }) {
		return getRepository(SupplierPayment)
			.createQueryBuilder("sp")
			.leftJoinAndSelect("sp.grn", "grn")
			.select([
				"sp.id",
				"sp.pnumber",
				"sp.payAmount",
				"grn.id",
				"grn.grncode",
				"sp.addedDate",
			])
			.leftJoinAndSelect("sp.supplierPaymentMethod", "spm")
			.leftJoinAndSelect("sp.supplierPaymentStatus", "sps")
			.where("sp.pnumber LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("sp.payAmount LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("grn.grncode LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("spm.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("sps.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orderBy("sp.pnumber", "DESC")
			.skip(skip)
			.take(15)
			.getMany();
	}

	static getOne(id) {
		return getRepository(SupplierPayment)
			.createQueryBuilder("sp")
			.leftJoin("sp.employee", "emp")
			.leftJoinAndSelect("sp.grn", "grn")
			.leftJoinAndSelect("grn.purchaseOrder", "po")
			.leftJoinAndSelect("po.quotation", "poq")
			.leftJoinAndSelect("poq.quotationRequest", "poqr")
			.leftJoinAndSelect("poqr.supplier", "poqrs")
			.leftJoinAndSelect("sp.supplierPaymentMethod", "spm")
			.leftJoinAndSelect("sp.supplierPaymentStatus", "sps")
			.addSelect(["emp.id", "emp.number", "emp.callingName"])
			.where("sp.id = :keyword", { keyword: id })
			.getOne();
	}
}
