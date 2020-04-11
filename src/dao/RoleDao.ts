import { getRepository } from "typeorm";
import { Role } from "../entity/Role";

export class RoleDao {
    static search({ keyword="", skip = 0 }) {
        return getRepository(Role)
            .createQueryBuilder("r")
            .leftJoinAndSelect("r.privilages", "p")
            .leftJoinAndSelect("p.module", "m")
            .where("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}