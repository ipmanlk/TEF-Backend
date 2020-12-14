import { getRepository } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice";

export class CustomerInvoiceDao {
	static search({ keyword = "", skip = 0 }) {
		return getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.leftJoin("ci.customerOrder", "co")
			.leftJoin("ci.customerPaymentMethod", "cpm")
			.select([
				"ci.id",
				"ci.code",
				"ci.netTotal",
				"ci.payedAmount",
				"ci.addedDate",
				"cpm.id",
				"cpm.name",
			])
			.leftJoinAndSelect("ci.customerInvoiceStatus", "cis")
			.where("ci.code LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("ci.netTotal LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("ci.payedAmount LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("ci.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("ci.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("cpm.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("cis.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orderBy("ci.code", "DESC")
			.skip(skip)
			.take(15)
			.getMany();
	}

	static getOne(id) {
		return getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.leftJoinAndSelect("ci.customer", "cic")
			.leftJoinAndSelect("ci.customerOrder", "cico")
			.leftJoinAndSelect("ci.customerInvoiceStatus", "cis")
			.leftJoinAndSelect("ci.customerPaymentMethod", "cpm")
			.leftJoinAndSelect("ci.customerInvoiceProductPackages", "cipkg")
			.leftJoinAndSelect("ci.customerInvoiceCustomerType", "cict")
			.leftJoin("cipkg.productPackage", "cipkgpkg")
			.addSelect(["cipkgpkg.id", "cipkgpkg.code", "cipkgpkg.name"])
			.leftJoin("ci.employee", "emp")
			.addSelect(["emp.id", "emp.number", "emp.callingName"])
			.where("ci.id = :keyword", { keyword: id })
			.getOne();
	}
}
