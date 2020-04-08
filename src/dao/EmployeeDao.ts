import { getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

export class EmployeeDao {
    static search({ keyword }) {
        return getRepository(Employee)
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.designation", "de")
        .leftJoinAndSelect("e.civilStatus", "cs")
        .leftJoinAndSelect("e.employeeStatus", "es")
        .select("e.id")
        .addSelect("e.number")
        .addSelect("e.fullName")
        .addSelect("e.callingName")
        .addSelect("e.nic")
        .addSelect("e.mobile")
        .addSelect("de.name")
        .addSelect("cs.name")
        .addSelect("es.name")
        .where("e.number LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("e.fullName LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("e.callingName LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("e.nic LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("e.mobile LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("de.name LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("cs.name LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("es.name LIKE :keyword", { keyword: `%${keyword}%` })
        .limit(15)
        .getMany();
    }
}