import { getRepository } from "typeorm";
import { PurchaseOrder } from "../entity/PurchaseOrder";
import { PurchaseOrderMaterial } from "../entity/PurchaseOrderMaterial";
import { PurchaseOrderStatus } from "../entity/PurchaseOrderStatus";
import { Quotation } from "../entity/Quotation";
import { QuotationStatus } from "../entity/QuotationStatus";
import { PurchaseOrderDao } from "../dao/PurchaseOrderDao";
import { MiscUtil } from "../util/MiscUtil";

export class PurchaseOrderController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await PurchaseOrderDao.getOne(id).catch(e => {
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
      entry["createdEmployee"] = `${entry.employee.fullName} (${entry.employee.number})`;
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
    const entries = await PurchaseOrderDao.search(data).catch(e => {
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

    // create purchase order code
    const lastEntry = await getRepository(PurchaseOrder).findOne({
      select: ["id", "pocode"],
      order: { id: "DESC" }
    });

    if (lastEntry) {
      data.pocode = MiscUtil.getNextNumber("PUR", lastEntry.pocode, 5);
    } else {
      data.pocode = MiscUtil.getNextNumber("PUR", undefined, 5);
    }

    // create a purchase order object
    const purchase_order = data as PurchaseOrder;

    // set created employee
    purchase_order.employeeId = session.data.employeeId;


    try {
      // save entry
      const entry = await getRepository(PurchaseOrder).save(purchase_order);

      // set empty array for purchase order materials
      const purchaseOrderMaterials = [];

      data.purchaseOrderMaterials.forEach(pom => {
        const purchaseOrderMaterial = new PurchaseOrderMaterial();
        purchaseOrderMaterial.purchaseOrderId = entry.id;
        purchaseOrderMaterial.materialId = pom.materialId;
        purchaseOrderMaterial.purchasePrice = pom.purchasePrice;
        purchaseOrderMaterial.qty = pom.qty;
        purchaseOrderMaterial.lineTotal = pom.lineTotal;
        purchaseOrderMaterial.unitTypeId = pom.unitTypeId;
        purchaseOrderMaterials.push(purchaseOrderMaterial);
      });

      // save purchase order materials
      await getRepository(PurchaseOrderMaterial).save(purchaseOrderMaterials);


      // mark quotation as completed
      const quotationCompletedStatus = await getRepository(QuotationStatus).findOne({ where: { name: "Completed" } });

      const quotation = await getRepository(Quotation).findOne(entry.quotationId);
      quotation.quotationStatus = quotationCompletedStatus;

      await getRepository(Quotation).save(quotation);

      // send success response
      return {
        status: true,
        data: { pocode: entry.pocode },
        msg: "Purchase order has been created!"
      };

    } catch (e) {
      console.log(e.code, e);

      if (e.code == "ER_DUP_ENTRY") {
        throw {
          status: false,
          type: "input",
          msg: "Purchase order already exists for the given quotation!."
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
    const selectedEntry = await getRepository(PurchaseOrder).findOne(data.id).catch(e => {
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

    const editedEntry = data as PurchaseOrder;

    try {
      // remove existing purchase order materials
      await getRepository(PurchaseOrderMaterial).createQueryBuilder()
        .delete()
        .where("purchaseOrderId = :id", { id: editedEntry.id })
        .execute();

      // update purchase order
      await getRepository(PurchaseOrder).save(editedEntry);

      // set empty array for purchase order materials
      const purchaseOrderMaterials = [];

      data.purchaseOrderMaterials.forEach(pom => {
        const purchaseOrderMaterial = new PurchaseOrderMaterial();
        purchaseOrderMaterial.purchaseOrderId = editedEntry.id;
        purchaseOrderMaterial.materialId = pom.materialId;
        purchaseOrderMaterial.purchasePrice = pom.purchasePrice;
        purchaseOrderMaterial.qty = pom.qty;
        purchaseOrderMaterial.lineTotal = pom.lineTotal;
        purchaseOrderMaterial.unitTypeId = pom.unitTypeId;
        purchaseOrderMaterials.push(purchaseOrderMaterial);
      });

      // save purchase order materials
      await getRepository(PurchaseOrderMaterial).save(purchaseOrderMaterials);

    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "Purchase order has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(PurchaseOrder).findOne({ id: id }).catch(e => {
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
    const deletedStatus = await getRepository(PurchaseOrderStatus).findOne({ name: "Deleted" }).catch(e => {
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
    entry.purchaseOrderStatus = deletedStatus;

    await getRepository(PurchaseOrder).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That purchase order has been deleted!"
    };
  }

  // find purchase orders belong to single supplier
  static async getSupplierPurchaseOrders({ supplierId, purchaseOrderStatusName }) {
    let entires = await PurchaseOrderDao.getSupplierPurchaseOrders(supplierId, purchaseOrderStatusName).catch(e => {
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