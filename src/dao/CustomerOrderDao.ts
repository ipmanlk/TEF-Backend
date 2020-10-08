import { getRepository } from "typeorm";
import { CustomerOrder } from "../entity/CustomerOrder";

export class CustomerOrderDao {
  static search({ keyword = "", skip = 0, limit = 15 }) {
    return getRepository(CustomerOrder)
      .createQueryBuilder("co")
      .leftJoinAndSelect("co.customer", "cus")
      .select([
        "co.id", "co.cocode", "co.grandTotal", "co.discountRatio", "co.netTotal", "co.requiredDate", "co.addedDate", "cus.id", "cus.number"
      ])
      .leftJoinAndSelect("co.customerOrderStatus", "cos")
      .where("co.cocode LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("co.grandTotal LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("co.discountRatio LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("co.netTotal LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("co.requiredDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("co.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cos.name LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cus.number LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cus.customerName LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cus.companyName LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(limit)
      .getMany()
  }


  static getOne(id) {
    return getRepository(CustomerOrder)
      .createQueryBuilder("co")
      .leftJoin("co.employee", "emp")
      .leftJoin("co.customer", "cus")
      .addSelect([
        "emp.id", "emp.number", "emp.callingName", "cus.id", "cus.number",
      ])
      .leftJoinAndSelect("co.customerOrderStatus", "cos")
      .leftJoinAndSelect("co.customerOrderProductPackages", "copps")
      .leftJoin("copps.productPackage", "copp")
      .addSelect(["copp.id", "copp.code", "copp.name", "copp.salePrice"])
      .where("co.id = :keyword", { keyword: id })
      .getOne()
  }

  // // get purchase orders belong to a single supplier
  // static getSupplierPurchaseOrders(supplierId, purchaseOrderStatusName = "") {
  //   return getRepository(PurchaseOrder)
  //     .createQueryBuilder("po")
  //     .leftJoinAndSelect("po.purchaseOrderStatus", "pos")
  //     .leftJoin("po.quotation", "poq")
  //     .leftJoin("poq.quotationRequest", "poqr")
  //     .where("poqr.supplierId = :supplierId", { supplierId: supplierId })
  //     .andWhere("pos.name LIKE :statusName", { statusName: `%${purchaseOrderStatusName}%` })
  //     .getMany()
  // }
}