import { getRepository } from "typeorm";
import { Material } from "../entity/Material";

export class MaterialDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Material)
            .createQueryBuilder("m")
            .leftJoinAndSelect("m.materialType", "mt")
            .leftJoinAndSelect("m.materialStatus", "ms")
            .leftJoinAndSelect("m.riskCategory", "rc")
            .leftJoinAndSelect("m.unitType", "ut")
            .where("m.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.code LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.unitPrice LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.expireDuration LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("m.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ms.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("mt.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}