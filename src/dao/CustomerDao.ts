import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";

export class CustomerDao {
	static search({ keyword = "", skip = 0, limit = 15 }) {
		if (limit != 0) {
			return getRepository(Customer)
				.createQueryBuilder("c")
				.leftJoinAndSelect("c.employee", "ce")
				.select([
					"c.id", "c.customerName", "c.number", "c.customerMobile", "c.toBePaid", "c.points", "c.companyName", "c.companyMobile", "c.address", "c.nic", "c.genderId", "c.email", "c.customerStatusId", "c.description", "c.addedDate", "ce.id", "ce.number"
				])
				.leftJoinAndSelect("c.customerStatus", "cs")
				.leftJoinAndSelect("c.customerType", "ct")
				.where("c.customerName LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("c.companyName LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("c.address LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("c.nic LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("c.email LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("cs.name LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("ct.name LIKE :keyword", { keyword: `%${keyword}%` })
				.skip(skip)
				.take(limit)
				.getMany()
		} else {
			return getRepository(Customer)
				.createQueryBuilder("c")
				.select([
					"c.id", "c.customerName", "c.number", "c.companyName",
				])
				.leftJoin("c.customerStatus", "cs")
				.leftJoinAndSelect("c.customerType", "ct")
				.where("cs.name <> :statusName", { statusName: "Deleted" })
				.getMany()
		}
	}
}