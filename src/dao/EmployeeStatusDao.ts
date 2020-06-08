import { getRepository } from "typeorm";
import { EmployeeStatus } from "../entity/EmployeeStatus";

export class EmployeeStatusDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(EmployeeStatus)
            .createQueryBuilder("d")
            .where("d.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}