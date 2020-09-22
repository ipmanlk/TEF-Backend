import { getRepository } from "typeorm";
import { PurchaseOrder } from "../entity/PurchaseOrder";

export class PurchaseOrderDao {
  static search({ keyword = "", skip = 0 }) {
    return getRepository(PurchaseOrder)
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.quotation", "q")
      .select([
        "po.id", "po.pocode", "po.quotationId", "po.requiredDate", "po.addedDate", "po.totalPrice", "q.id", "q.qnumber"
      ])
      .leftJoinAndSelect("po.purchaseOrderStatus", "pos")
      .where("po.pocode LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("po.requiredDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("po.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("po.totalPrice LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("q.qnumber LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("pos.name LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }


  static getOne(id) {
    return getRepository(PurchaseOrder)
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.employee", "emp")
      .leftJoinAndSelect("po.quotation", "poq")
      .select([
        "po.id", "po.pocode", "po.requiredDate", "po.addedDate", "po.totalPrice", "po.description", "emp.id", "emp.number", "emp.fullName", "poq.id", "poq.qnumber"
      ])
      .leftJoinAndSelect("po.purchaseOrderStatus", "pos")
      .leftJoinAndSelect("po.purchaseOrderMaterials", "pom")
      .leftJoinAndSelect("pom.material", "pomm")
      .leftJoinAndSelect("pomm.unitType", "ut")
      .leftJoinAndSelect("poq.quotationRequest", "poqr")
      .leftJoinAndSelect("poqr.supplier", "poqrs")
      .where("po.id = :keyword", { keyword: id })
      .getOne()
  }
}