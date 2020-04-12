import { getRepository } from "typeorm";
import { Role } from "../entity/Role";
import { Privilege } from "../entity/Privilege";

export class PrivilegeDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Role)
            .createQueryBuilder("r")
            .leftJoinAndSelect("r.privileges", "p")
            .leftJoinAndSelect("p.module", "m")
            .where("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }

    static delete(roleId) {
        return getRepository(Privilege)
            .createQueryBuilder()
            .delete()
            .where("roleId = :id", { id: roleId })
            .execute();
    }
}