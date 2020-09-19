import { getRepository } from "typeorm";
import { QuotationRequest } from "../entity/QuotationRequest";
import { QuotationRequestMaterial } from "../entity/QuotationRequestMaterial";
import { QuotationRequestStatus } from "../entity/QuotationRequestStatus";

import { QuotationRequestDao } from "../dao/QuotationRequestDao";
import { MiscUtil } from "../util/MiscUtil";

export class QuotationRequestController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await QuotationRequestDao.getOne(id).catch(e => {
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
    const qrs = await QuotationRequestDao.search(data).catch(e => {
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

    // create quatation request number
    const lastEntry = await getRepository(QuotationRequest).findOne({
      select: ["id", "qrnumber"],
      order: { id: "DESC" }
    });

    // set code for new material
    if (lastEntry) {
      data.qrnumber = MiscUtil.getNextNumber("QRN", lastEntry.qrnumber, 5);
    } else {
      data.qrnumber = MiscUtil.getNextNumber("QRN", undefined, 5);
    }

    // create an quatation request object
    const quatationRequest = data as QuotationRequest;

    // set created employee
    quatationRequest.employeeId = session.data.employeeId;

    // save entry
    const entry = await getRepository(QuotationRequest).save(quatationRequest).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // set empty array for quatation request material
    const requestMaterials = [];
    data.requestMaterials.forEach(rm => {
      const requestMaterial = new QuotationRequestMaterial();
      requestMaterial.quotationRequest = entry;
      requestMaterial.materialId = rm.materialId;
      requestMaterial.requested = rm.requested;
      requestMaterial.accepted = rm.accepted;
      requestMaterial.received = rm.received;
      requestMaterials.push(requestMaterial);
    });

    // save request materials
    await getRepository(QuotationRequestMaterial).save(requestMaterials).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: { qrnumber: entry.qrnumber },
      msg: "Quotation request has been created!"
    };
  }

  static async update(data) {

    // check if an entry is present with given id
    const selectedEntry = await getRepository(QuotationRequest).findOne(data.id).catch(e => {
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

    const editedEntry = data as QuotationRequest;
    editedEntry.employeeId = selectedEntry.employeeId;

    try {
      // update quatation request
      await getRepository(QuotationRequest).save(editedEntry);

      // create request materials array
      const requestMaterials = [];
      data.requestMaterials.forEach(rm => {
        const requestMaterial = new QuotationRequestMaterial();
        requestMaterial.quotationRequestId = editedEntry.id;
        requestMaterial.materialId = rm.materialId;
        requestMaterial.requested = rm.requested;
        requestMaterial.accepted = rm.accepted;
        requestMaterial.received = rm.received;
        requestMaterials.push(requestMaterial);
      });

      // remove existing request materials
      await getRepository(QuotationRequestMaterial).createQueryBuilder()
        .delete()
        .where("quotationRequestId = :id", { id: editedEntry.id })
        .execute();

      // save request materials
      await getRepository(QuotationRequestMaterial).save(requestMaterials);

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
    const entry = await getRepository(QuotationRequest).findOne({ id: id }).catch(e => {
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
    const deletedStatus = await getRepository(QuotationRequestStatus).findOne({ name: "Deleted" }).catch(e => {
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
    entry.quotationRequestStatus = deletedStatus;

    await getRepository(QuotationRequest).save(entry).catch(e => {
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
  static async getSupplierRequests({ supplierId, quotationRequestStatusName }) {
    let entires = await QuotationRequestDao.getSupplierRequests(supplierId, quotationRequestStatusName).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      data: entires,
      status: true
    };
  }

}