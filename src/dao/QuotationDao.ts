import { getRepository } from "typeorm";
import { Quotation } from "../entity/Quotation";

export class QuotationDao {
  static search({ keyword = "", skip = 0 }) {
    return getRepository(Quotation)
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.quotationRequest", "qr")
      .select([
        "q.id", "q.qnumber", "q.validFrom", "q.validTo", "qr.id", "qr.qrnumber"
      ])
      .leftJoinAndSelect("q.quotationStatus", "qs")
      .where("q.qnumber LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("q.validFrom LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("q.validTo LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("qr.qrnumber LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("qs.name LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }


  static getOne(id) {
    return getRepository(Quotation)
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.employee", "emp")
      .select([
        "q.id", "q.qnumber", "q.validFrom", "q.validTo", "q.description", "q.addedDate", "emp.id", "emp.number", "emp.fullName"
      ])
      .leftJoinAndSelect("q.quotationStatus", "qs")
      .leftJoinAndSelect("q.quotationMaterials", "qm")
      .leftJoinAndSelect("qm.material", "qmm")
      .leftJoinAndSelect("qmm.unitType", "ut")
      .leftJoinAndSelect("q.quotationRequest", "qr")
      .where("q.id = :keyword", { keyword: id })
      .getOne()
  }
}