import { getRepository } from "typeorm";
import { Quotation } from "../entity/Quotation";
import { QuotationMaterial } from "../entity/QuotationMaterial";
import { QuotationStatus } from "../entity/QuotationStatus";

import { QuotationDao } from "../dao/QuotationDao";
import { MiscUtil } from "../util/MiscUtil";

export class QuotationController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await QuotationDao.getOne(id).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      };
    });

    // check if entry exists
    if (entry !== undefined) {
      // remove useless elements
      entry["createdEmployee"] = `${entry.employee.number} (${entry.employee.fullName})`;
      delete entry.employee;

      return {
        status: true,
        data: entry
      };
    } else {
      throw {
        status: false,
        type: "input",
        msg: "Unable to find an entry with that id."
      };
    }
  }

  private static async search(data = {}) {
    const qrs = await QuotationDao.search(data).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: qrs
    };
  }

  static async save(data, session) {

    // create quatation number
    const lastEntry = await getRepository(Quotation).findOne({
      select: ["id", "qnumber"],
      order: { id: "DESC" }
    });

    // set a qnumber for new entry
    if (lastEntry) {
      data.qnumber = MiscUtil.getNextNumber("QUO", lastEntry.qnumber, 5);
    } else {
      data.qnumber = MiscUtil.getNextNumber("QUO", undefined, 5);
    }

    // create a quotation object
    const quotation = data as Quotation;

    // set created employee
    quotation.employeeId = session.data.employeeId;

    // save entry
    const entry = await getRepository(Quotation).save(quotation).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // set empty array for quatation materials
    const quotationMaterials = [];

    data.quotationMaterials.forEach(qm => {
      const quotationMaterial = new QuotationMaterial();
      quotationMaterial.materialId = qm.materialId;
      quotationMaterial.quotationId = entry.id;
      quotationMaterial.purchasePrice = qm.purchasePrice;
      quotationMaterial.availableQty = qm.availableQty;
      quotationMaterial.minimumRequestQty = qm.minimumRequestQty;
      quotationMaterial.unitTypeId = qm.unitTypeId;
      quotationMaterials.push(quotationMaterial);
    });

    // save quotation mateirals
    await getRepository(QuotationMaterial).save(quotationMaterials).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: { qnumber: entry.qnumber },
      msg: "Quotation has been created!"
    };
  }

  static async update(data) {

    // check if an entry is present with given id
    const selectedEntry = await getRepository(Quotation).findOne(data.id).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    if (!selectedEntry) {
      throw {
        status: false,
        type: "input",
        msg: "That entry doesn't exist in our database!."
      }
    }

    const editedEntry = data as Quotation;
    editedEntry.employeeId = selectedEntry.employeeId;

    try {
      // update quatation request
      await getRepository(Quotation).save(editedEntry);

      // create request materials array
      // const requestMaterials = [];
      // data.requestMaterials.forEach(rm => {
      //   const requestMaterial = new QuotationMaterial();
      //   requestMaterial.QuotationId = editedEntry.id;
      //   requestMaterial.materialId = rm.materialId;
      //   requestMaterial.requested = rm.requested;
      //   requestMaterial.accepted = rm.accepted;
      //   requestMaterial.received = rm.received;
      //   requestMaterials.push(requestMaterial);
      // });

      // remove existing request materials
      await getRepository(QuotationMaterial).createQueryBuilder()
        .delete()
        .where("QuotationId = :id", { id: editedEntry.id })
        .execute();

      // save request materials
      // await getRepository(QuotationMaterial).save(requestMaterials);

    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "Quotation request has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(Quotation).findOne({ id: id }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    if (!entry) {
      throw {
        status: false,
        type: "input",
        msg: "That entry doesn't exist in our database!."
      }
    }

    // find deleted status
    const deletedStatus = await getRepository(QuotationStatus).findOne({ name: "Deleted" }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // if there is no status called deleted
    if (!deletedStatus) {
      throw {
        status: false,
        type: "server",
        msg: "Deleted status doesn't exist in the database!."
      }
    }

    // set status to delete
    entry.quotationStatus = deletedStatus;

    await getRepository(Quotation).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That quatation request has been deleted!"
    };
  }

  // find requests belong to single supplier
  static async getSupplierRequests({ supplierId }) {
    let entires = await getRepository(Quotation).find({
      where: { supplierId: supplierId },
      relations: ["QuotationStatus"]
    }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // filter out accepted ones and deleted ones
    entires = entires.filter(e => e.quotationStatus.name !== "Accepted" && e.quotationStatus.name !== "Deleted");

    return {
      data: entires,
      status: true
    };
  }

}