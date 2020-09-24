import { getRepository } from "typeorm";
import { QuotationRequest } from "../entity/QuotationRequest";

export class QuotationRequestDao {

  // search quotation requests (for table)
  static search({ keyword = "", skip = 0 }) {
    return getRepository(QuotationRequest)
      .createQueryBuilder("qr")
      .leftJoinAndSelect("qr.supplier", "sup")
      .select([
        "qr.id", "qr.qrnumber", "qr.addedDate", "qr.dueDate", "sup.id", "sup.personName", "sup.companyName"
      ])
      .leftJoinAndSelect("qr.quotationRequestStatus", "qrs")
      .where("qr.qrnumber LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("qr.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("qr.dueDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("qrs.name LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("sup.personName LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("sup.companyName LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }

  // get single quotation request (for editing and viewing)
  static getOne(id) {
    return getRepository(QuotationRequest)
      .createQueryBuilder("qr")
      .leftJoinAndSelect("qr.employee", "emp")
      .select([
        "qr.id", "qr.qrnumber", "qr.description", "qr.addedDate", "qr.dueDate", "qr.description", "emp.id", "emp.number", "emp.callingName"
      ])
      .leftJoinAndSelect("qr.supplier", "sup")
      .leftJoinAndSelect("qr.quotationRequestStatus", "qrs")
      .leftJoinAndSelect("qr.quotationRequestMaterials", "qrm")
      .leftJoinAndSelect("qrm.material", "m")
      .leftJoinAndSelect("m.unitType", "ut")
      .where("qr.id = :keyword", { keyword: id })
      .getOne()
  }

  // get quotation requests belong to a single supplier
  static getSupplierRequests(supplierId, quotationRequestStatusName = "") {
    return getRepository(QuotationRequest)
      .createQueryBuilder("qr")
      .leftJoinAndSelect("qr.quotationRequestStatus", "qrs")
      .where("qr.supplierId = :supplierId", { supplierId: supplierId })
      .andWhere("qrs.name LIKE :statusName", { statusName: `%${quotationRequestStatusName}%` })
      .getMany()
  }
}