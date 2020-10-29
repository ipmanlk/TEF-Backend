import { getRepository } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice";

export class CustomerInvoiceDao {
  static search({ keyword = "", skip = 0 }) {
    return getRepository(CustomerInvoice)
      .createQueryBuilder("ci")
      .leftJoin("ci.customerOrder", "co")
      .leftJoin("ci.customerPaymentMethod", "cpm")
      .select([
        "ci.id", "ci.code", "ci.netTotal", "ci.payAmount", "ci.addedDate", "cpm.id", "cpm.name"
      ])
      .leftJoinAndSelect("ci.customerInvoiceStatus", "cis")
      .where("ci.code LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("ci.netTotal LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("ci.payAmount LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("ci.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("ci.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cpm.name LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("cis.name LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }


  static getOne(id) {
    return getRepository(CustomerInvoice)
      .createQueryBuilder("ci")
      .leftJoin("ci.employee", "emp")
      .select(["emp.id", "emp.number", "emp.callingName"])
      .leftJoinAndSelect("ci.customerOrder", "cico")
      .leftJoinAndSelect("cico.customerOrderProductPackage", "cicopkg")
      .leftJoinAndSelect("ci.customerInvoiceStatus", "cis")
      .leftJoinAndSelect("ci.customerPaymentMethod", "cpm")
      .leftJoinAndSelect("ci.customerInvoiceProductPackage", "cipkg")
      .leftJoinAndSelect("cipkg.productPackage", "cipkgpkg")
      .where("ci.id = :keyword", { keyword: id })
      .getOne()
  }
}