import { getRepository } from "typeorm";
import { ProductionInventory } from "../entity/ProductionInventory";

export class ProductionInventoryDao {
  static search({ keyword = "", skip = 0, limit = 15 }) {
    if (limit != 0) {
      return getRepository(ProductionInventory)
        .createQueryBuilder("po")
        .leftJoinAndSelect("po.productionInventoryStatus", "pis")
        .leftJoin("po.productPackage", "pkg")
        .addSelect(["pkg.id", "pkg.code", "pkg.name"])
        .where("pkg.name LIKE :keyword", { keyword: `%${keyword}%` })
        .orWhere("pkg.code LIKE :keyword", { keyword: `%${keyword}%` })
        .skip(skip)
        .take(limit)
        .getMany()
    } else {
      return getRepository(ProductionInventory)
        .createQueryBuilder("po")
        .leftJoinAndSelect("po.productionInventoryStatus", "pis")
        .leftJoin("po.productPackage", "pkg")
        .addSelect(["pkg.id", "pkg.code", "pkg.name"])
        .getMany()
    }
  }
}