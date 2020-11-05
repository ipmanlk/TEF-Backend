import { MaterialInventoryDao } from "../dao/MaterialInventoryDao";

export class MaterialInventoryController {

  static async get(data) {
    return this.search(data);
  }

  private static async search(data = {}) {
    const entries = await MaterialInventoryDao.search(data).catch(e => {
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