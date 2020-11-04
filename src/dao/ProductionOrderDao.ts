import { getRepository } from "typeorm";
import { ProductionOrder } from "../entity/ProductionOrder";

export class ProductionOrderDao {
  static search({ keyword = "", skip = 0 }) {
    return getRepository(ProductionOrder)
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.productionOrderStatus", "pos")
      .where("po.code LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("po.requiredDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("pos.name LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }


  static getOne(id) {
    return getRepository(ProductionOrder)
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.productOrderProductPackages", "popkg")
      .leftJoinAndSelect("po.productionOrderStatus", "pos")
      .leftJoin("po.employee", "emp")
      .addSelect(["emp.id", "emp.number", "emp.callingName"])
      .leftJoin("popkg.productPackage", "pkg")
      .addSelect(["pkg.id", "pkg.name"])
      .where("po.id = :productionOrderId", { productionOrderId: id })
      .getOne()
  }
}