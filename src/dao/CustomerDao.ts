import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";

export class CustomerDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Customer)
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.employee", "ce")
            .select([
                "c.id", "c.name", "c.address", "c.nic", "c.genderId", "c.mobile", "c.land", "c.email", "c.customerStatusId", "c.description", "c.doregistration", "ce.id", "ce.number"
            ])
            .leftJoinAndSelect("c.customerStatus", "cs")            
            .where("c.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.address LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.nic LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.email LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("cs.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}