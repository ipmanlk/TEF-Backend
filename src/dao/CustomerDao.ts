import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";

export class CustomerDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Customer)
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.customerStatus", "cs")
            .leftJoin("c.employee", "ce")
            .select(["ce.id", "ce.number"])
            .where("c.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.address LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.nic LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.email LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("cs.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}