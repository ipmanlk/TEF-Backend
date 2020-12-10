
import { SummeryDao } from "../dao//SummeryDao";

export class SummeryController {

  static async getDashboardSummery() {
    try {
      return {
        status: true,
        data: {
          lowMaterials: await SummeryDao.getLowMaterials(),
          lowProductPackages: await SummeryDao.getLowProductPkgs(),
          cheques: await SummeryDao.getCheques(),
          upcomingCustomerOrders: await SummeryDao.getUpcomingCustomerOrders(),
          customerOrders: await SummeryDao.getCustomerOrders()
        }
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