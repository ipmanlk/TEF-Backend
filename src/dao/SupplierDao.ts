import { getRepository } from "typeorm";
import { Supplier } from "../entity/Supplier";

export class SupplierDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Supplier)
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.employee", "se")
            .select([
                "s.id", "s.personName", "s.code", "s.personMobile", "s.arrears", "s.companyName", "s.companyMobile", "s.address", "s.nic", "s.email", "s.supplierStatusId", "s.addedDate", "se.id", "se.number"
            ])
            .leftJoinAndSelect("s.supplierStatus", "ss")
            .where("s.code LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.companyName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.companyMobile LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.personName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.personMobile LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.nic LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("s.email LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ss.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}