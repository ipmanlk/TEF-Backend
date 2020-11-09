import { ProductionInventoryDao } from "../dao/ProductionInventoryDao";

export class ProductionInventoryController {

  static async get(data) {
    return this.search(data);
  }

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