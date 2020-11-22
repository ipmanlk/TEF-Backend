import { getRepository, getManager } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice"
import * as moment from "moment";

export class ReportController {

  static async getSales(start: string, end: string, type: string) {
    let query;

    const startDate = moment(start).format("YYYY-MM-DD");
    const endDate = moment(end).format("YYYY-MM-DD");

    switch (type) {
      case "week":
        query = `
        SELECT FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7)) AS week_beginning,
        SUM(net_total) AS net_total,
         SUM(payed_amount) AS payed_amount,
         COUNT(*) AS transactions
        FROM customer_invoice
        WHERE added_date >= "2020-11-01" AND added_date <= "2020-11-15"
        GROUP BY FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7))
        ORDER BY FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7))
        `
        break;

      default:
        break;
    }

    const rawResults = await getRepository(CustomerInvoice).query("");
  }

}