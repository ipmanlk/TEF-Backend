import { getRepository } from "typeorm";
import { MaterialInventory } from "../entity/MaterialInventory";

export class MaterialInventoryDao {
  static search({ keyword = "", skip = 0, limit = 15 }) {
    if (limit != 0) {
      return getRepository(MaterialInventory)
        .createQueryBuilder("mi")
        .leftJoinAndSelect("mi.materialInventoryStatus", "mis")
        .leftJoinAndSelect("mi.material", "m")
        .where("m.name LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("m.code LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("m.unitPrice LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("m.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("mi.qty LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("mi.availableQty LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("mis.name LIKE :keyword", { keyword: `%${keyword}%` })
        .skip(skip)
        .take(limit)
        .getMany()
    } else {
      return getRepository(MaterialInventory)
        .createQueryBuilder("mi")
        .leftJoin("mi.material", "m")
        .addSelect(["m.id", "m.code", "m.name"])
        .leftJoinAndSelect("m.unitType", "ut")
        .getMany()
    }
  }
}