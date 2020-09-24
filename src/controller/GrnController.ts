import { getRepository } from "typeorm";
import { Grn } from "../entity/Grn";
import { GrnStatus } from "../entity/GrnStatus";
import { GrnMaterial } from "../entity/GrnMaterial";
import { GrnDao } from "../dao/GrnDao";
import { PurchaseOrder } from "../entity/PurchaseOrder";
import { PurchaseOrderStatus } from "../entity/PurchaseOrderStatus";
import { MaterialInventory } from "../entity/MaterialInventory";
import { MiscUtil } from "../util/MiscUtil";

export class GrnController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  static async getOne({ id }) {
    // search for an entry with given id
    const entry = await GrnDao.getOne(id).catch(e => {
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
    const entries = await GrnDao.search(data).catch(e => {
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

    // create grn code
    const lastEntry = await getRepository(Grn).findOne({
      select: ["id", "grncode"],
      order: { id: "DESC" }
    });

    if (lastEntry) {
      data.grncode = MiscUtil.getNextNumber("GRN", lastEntry.grncode, 5);
    } else {
      data.grncode = MiscUtil.getNextNumber("GRN", undefined, 5);
    }

    // create a grn object
    const grn = data as Grn;

    // set created employee
    grn.employeeId = session.data.employeeId;


    try {
      // save entry
      const entry = await getRepository(Grn).save(grn);

      // set empty array for grn materials
      const grnMaterials = [];

      for (let gm of data.grnMaterials) {
        const grnMaterial = new GrnMaterial();
        grnMaterial.grnId = entry.id;
        grnMaterial.materialId = gm.materialId;
        grnMaterial.purchasePrice = gm.purchasePrice;
        grnMaterial.receivedQty = gm.receivedQty;
        grnMaterial.lineTotal = gm.lineTotal;
        grnMaterial.unitTypeId = gm.unitTypeId;
        grnMaterials.push(grnMaterial);

        // update material inventory
        const miMaterial = await getRepository(MaterialInventory).findOne({ where: { materialId: gm.materialId } });

        if (miMaterial) {
          miMaterial.qty = (parseFloat(miMaterial.qty) + parseFloat(grnMaterial.receivedQty)).toString();
          miMaterial.availableQty = (parseFloat(miMaterial.availableQty) + parseFloat(grnMaterial.receivedQty)).toString();
          
          await getRepository(MaterialInventory).save(miMaterial);

        } else {
          const newMiMaterail = new MaterialInventory();
          newMiMaterail.materialId = grnMaterial.materialId;
          newMiMaterail.availableQty = grnMaterial.receivedQty;
          newMiMaterail.qty = grnMaterial.receivedQty;
          newMiMaterail.materialInventoryStatusId = 1;

          await getRepository(MaterialInventory).save(newMiMaterail);
        }
      }

      // save grn materials
      await getRepository(GrnMaterial).save(grnMaterials);

      // mark purchase order as completed
      const purchaseOrderCompletedStatus = await getRepository(PurchaseOrderStatus).findOne({ where: { name: "Completed" } });

      const purchaseOrder = await getRepository(PurchaseOrder).findOne(entry.purchaseOrderId);
      purchaseOrder.purchaseOrderStatus = purchaseOrderCompletedStatus;

      await getRepository(PurchaseOrder).save(purchaseOrder);

      // send success response
      return {
        status: true,
        data: { grncode: entry.grncode },
        msg: "GRN has been created!"
      };

    } catch (e) {
      console.log(e.code, e);

      if (e.code == "ER_DUP_ENTRY") {
        throw {
          status: false,
          type: "input",
          msg: "GRN already exists for the given purchase order!."
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
    const selectedEntry = await getRepository(Grn).findOne(data.id).catch(e => {
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

    const editedEntry = data as Grn;

    try {
      // remove existing grn materials
      await getRepository(GrnMaterial).createQueryBuilder()
        .delete()
        .where("grnId = :id", { id: editedEntry.id })
        .execute();

      // update grn
      await getRepository(Grn).save(editedEntry);

      // set empty array for grn materials
      const grnMaterials = [];

      data.grnMaterials.forEach(gm => {
        const grnMaterial = new GrnMaterial();
        grnMaterial.grnId = editedEntry.id;
        grnMaterial.materialId = gm.materialId;
        grnMaterial.purchasePrice = gm.purchasePrice;
        grnMaterial.receivedQty = gm.receivedQty;
        grnMaterial.lineTotal = gm.lineTotal;
        grnMaterial.unitTypeId = gm.unitTypeId;
        grnMaterials.push(grnMaterial);
      });

      // save grn materials
      await getRepository(GrnMaterial).save(grnMaterials);

    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "GRN has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(Grn).findOne({ id: id }).catch(e => {
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
    const deletedStatus = await getRepository(GrnStatus).findOne({ name: "Deleted" }).catch(e => {
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
    entry.grnStatus = deletedStatus;

    await getRepository(Grn).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That GRN has been deleted!"
    };
  }

  // find grns belong to single supplier
  static async getSupplierGrns({ supplierId, grnStatusName }) {
    let entires = await GrnDao.getSupplierGrns(supplierId, grnStatusName).catch(e => {
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