
import { SummeryDao } from "../dao//SummeryDao";

export class SummeryController {

  static async getDashboardSummery() {
    try {
      return {
        status: true,
        lowMaterials: await SummeryDao.getLowMaterials(),
        lowProductPackages: await SummeryDao.getLowProductPkgs(),
        cheques: await SummeryDao.getCheques(),
        customerOrders: await SummeryDao.getCustomerOrders()
      }

    } catch (e) {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    }
  }

}