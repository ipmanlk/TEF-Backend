import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

export class EmployeeDao {
    static search({ keyword, skip }) {
        return getRepository(Employee)
            .createQueryBuilder("e")
            .leftJoinAndSelect("e.designation", "de")
            .leftJoinAndSelect("e.civilStatus", "cs")
            .leftJoinAndSelect("e.employeeStatus", "es")
            .select([
                "e.id", "e.number", "e.fullName", "e.callingName", "e.nic", "e.mobile", "de", "cs", "es"
            ])
            .where("e.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.fullName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.callingName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.nic LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.mobile LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("de.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("cs.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("es.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}