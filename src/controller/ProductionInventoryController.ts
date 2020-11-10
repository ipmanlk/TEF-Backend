import { ProductPackage } from "../entity/ProductPackage";
import { ProductPackageStatus } from "../entity/ProductPackageStatus";
import { ProductionInventory } from "../entity/ProductionInventory";
import { ProductionInventoryDao } from "../dao/ProductionInventoryDao";
import { getRepository } from "typeorm";
import { ProductionInventoryStatus } from "../entity/ProductionInventoryStatus";

export class ProductionInventoryController {

  static async get(data) {
    return this.search(data);
  }

  static async save(data, session) {
    // get data
    const productPackageId = data.productPackageId;
    const qty = parseInt(data.qty);

    // check if this product package is present in the inventory
    const inventoryProductPackage = await getRepository(ProductionInventory).findOne({
      where: {
        productPackageId: productPackageId
      }
    });

    // if exists in inventory
    if (inventoryProductPackage) {
      inventoryProductPackage.availableQty += qty;
      inventoryProductPackage.qty += qty;

      // update it
      await getRepository(ProductionInventory).save(inventoryProductPackage).catch(e => {
        console.log(e.code, e);
        throw {
          status: false,
          type: "server",
          msg: "Server Error!. Please check logs."
        };
      });

      return {
        status: true,
        msg: "Product packages has been added to the inventory!."
      }
    } else {

      // create new inventory product package
      const inventoryProductPackage = new ProductionInventory();
      inventoryProductPackage.productPackageId = productPackageId;
      inventoryProductPackage.availableQty = qty;
      inventoryProductPackage.qty = qty;

      const normalStatus = await getRepository(ProductionInventoryStatus).findOne({
        where: {
          name: "Normal"
        }
      });

      if (!normalStatus) {
        throw {
          status: false,
          type: "server",
          msg: "Unable to find the 'Normal' status"
        }
      }

      inventoryProductPackage.productionInventoryStatus = normalStatus;

      // save it
      await getRepository(ProductionInventory).save(inventoryProductPackage).catch(e => {
        console.log(e.code, e);
        throw {
          status: false,
          type: "server",
          msg: "Server Error!. Please check logs."
        };
      });

      return {
        status: true,
        msg: "Product packages has been added to the inventory!."
      }
    }
  }

  // search entires in the db
  private static async search(data = {}) {
    const entries = await ProductionInventoryDao.search(data).catch(e => {
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

}