import { getRepository } from "typeorm";
import { Grn } from "../entity/Grn";

export class GrnDao {
  static search({ keyword = "", skip = 0 }) {
    return getRepository(Grn)
      .createQueryBuilder("grn")
      .leftJoinAndSelect("grn.purchaseOrder", "po")
      .select([
        "grn.id", "grn.grncode", "grn.invoiceNo", "grn.netTotal", "grn.receivedDate", "po.id", "po.pocode"
      ])
      .leftJoinAndSelect("grn.grnStatus", "grns")
      .where("grn.grncode LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("grn.receivedDate LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("grn.invoiceNo LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("grn.netTotal LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("po.pocode LIKE :keyword", { keyword: `%${keyword}%` })
      .skip(skip)
      .take(15)
      .getMany()
  }


  static getOne(id) {
    return getRepository(Grn)
      .createQueryBuilder("grn")
      .leftJoinAndSelect("grn.employee", "emp")
      .leftJoinAndSelect("grn.purchaseOrder", "po")
      .leftJoinAndSelect("po.quotation", "poq")
      .leftJoinAndSelect("poq.quotationRequest", "poqr")
      .select([
        "grn.id", "grn.grncode", "grn.invoiceNo", "grn.netTotal", "grn.receivedDate", "grn.addedDate", "grn.grandTotal", "grn.discountRatio", "grn.description", "po.id", "po.pocode", "emp.id", "emp.number", "emp.fullName", "poq.id", "poq.qnumber", "poqr.id", "poqr.qrnumber"
      ])
      .leftJoinAndSelect("poqr.supplier", "poqrs")
      .leftJoinAndSelect("grn.grnStatus", "grns")
      .leftJoinAndSelect("grn.grnMaterials", "grnm")
      .leftJoinAndSelect("grnm.material", "grnmm")
      .leftJoinAndSelect("grnmm.unitType", "ut")
      .where("grn.id = :keyword", { keyword: id })
      .getOne()
  }
}