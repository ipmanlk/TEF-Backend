import { getRepository } from "typeorm";
import { Designation } from "../entity/Designation";

export class DesignationDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Designation)
            .createQueryBuilder("d")
            .where("d.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}