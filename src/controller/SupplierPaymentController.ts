import { getRepository } from "typeorm";
import { SupplierPayment } from "../entity/SupplierPayment";
import { SupplierPaymentStatus } from "../entity/SupplierPaymentStatus";
import { SupplierPaymentDao } from "../dao/SupplierPaymentDao";
import { Grn } from "../entity/Grn";
import { GrnController } from "../controller/GrnController";
import { GrnStatus } from "../entity/GrnStatus";
import { Supplier } from "../entity/Supplier";
import { MiscUtil } from "../util/MiscUtil";

export class SupplierPaymentController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await SupplierPaymentDao.getOne(id).catch(e => {
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
    const entries = await SupplierPaymentDao.search(data).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: entries
    };
  }

  static async save(data, session) {

    // create payment number
    const lastEntry = await getRepository(SupplierPayment).findOne({
      select: ["id", "pnumber"],
      order: { id: "DESC" }
    });

    if (lastEntry) {
      data.pnumber = MiscUtil.getNextNumber("SPA", lastEntry.pnumber, 5);
    } else {
      data.pnumber = MiscUtil.getNextNumber("SPA", undefined, 5);
    }

    // create supplier payment object
    const supplierPayment = data as SupplierPayment;

    // set created employee
    supplierPayment.employeeId = session.data.employeeId;


    try {
      // save entry
      const entry = await getRepository(SupplierPayment).save(supplierPayment);

      // mark grn as completed
      if (entry.payAmount >= entry.grnNetTotal) {
        const grn = await getRepository(Grn).findOne(entry.grnId);
        const grnCompletedStatus = await getRepository(GrnStatus).findOne({ where: { name: "Completed" } });
        grn.grnStatus = grnCompletedStatus;
        await getRepository(Grn).save(grn);
      }

      // update supplier arreas
      const grn = await GrnController.getOne({ id: entry.grnId });
      const supplier = await getRepository(Supplier).findOne(grn.data.purchaseOrder.quotation.quotationRequest.supplier.id);

      const supplierArrears = parseFloat(supplier.arrears);
      const balance = parseFloat(entry.balance);

      if (balance == 0) {
        supplier.arrears = "0.00";
      } else {
        supplier.arrears = (supplierArrears + balance).toString();
      }

      await getRepository(Supplier).save(supplier);

      // send success response
      return {
        status: true,
        data: { pnumber: entry.pnumber },
        msg: "New supplier payment has been added!"
      };

    } catch (e) {
      console.log(e.code, e);

      if (e.code == "ER_DUP_ENTRY") {
        throw {
          status: false,
          type: "input",
          msg: "Supplier payment already exists for the given GRN!."
        }
      }

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    }
  }

  static async update(data) {
    // check if an entry is present with given id
    const selectedEntry = await getRepository(SupplierPayment).findOne(data.id).catch(e => {
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

    const editedEntry = data as SupplierPayment;

    try {
      // save edited entry
      await getRepository(SupplierPayment).save(editedEntry);

    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "Supplier pyament has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(SupplierPayment).findOne({ id: id }).catch(e => {
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
    const deletedStatus = await getRepository(SupplierPaymentStatus).findOne({ name: "Deleted" }).catch(e => {
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
    entry.supplierPaymentStatus = deletedStatus;

    await getRepository(SupplierPayment).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That supplier payment has been deleted!"
    };
  }

}