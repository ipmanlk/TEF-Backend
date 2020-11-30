import { getRepository } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice"
import * as moment from "moment";

export class ReportController {

  static async getSales({ start, end, type }) {
    let query;

    let startDate = moment(start).format("YYYY-MM-DD");
    let endDate = moment(end).format("YYYY-MM-DD");

    switch (type) {
      case "today":
        query = `
        SELECT DATE(added_date) AS sales_date,
         SUM(net_total) AS net_total,
         SUM(payed_amount) AS payed_amount,
         COUNT(*) AS transactions
        FROM customer_invoice
        WHERE added_date = "${startDate}"
        GROUP BY DATE(added_date)
        ORDER BY DATE(added_date)
        `;
        break;
      case "day":
        query = `
        SELECT DATE(added_date) AS sales_date,
         SUM(net_total) AS net_total,
         SUM(payed_amount) AS payed_amount,
         COUNT(*) AS transactions
        FROM customer_invoice
        WHERE added_date >= "${startDate}" AND added_date <= "${endDate}"
        GROUP BY DATE(added_date)
        ORDER BY DATE(added_date)
        `;
        break;
      case "week":
        query = `
        SELECT FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7)) AS week_beginning,
        SUM(net_total) AS net_total,
         SUM(payed_amount) AS payed_amount,
         COUNT(*) AS transactions
        FROM customer_invoice
        WHERE added_date >= "${startDate}" AND added_date <= "${endDate}"
        GROUP BY FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7))
        ORDER BY FROM_DAYS(TO_DAYS(added_date) -MOD(TO_DAYS(added_date) -1, 7))
        `;
        break;
      case "month":
        endDate = moment(end).add(1, "month").format("YYYY-MM-DD");
        query = `
        SELECT DATE(DATE_FORMAT(added_date, '%Y-%m-01')) AS month_beginning,
         SUM(net_total) AS net_total,
         SUM(payed_amount) AS payed_amount,
         COUNT(*) AS transactions
        FROM customer_invoice
        WHERE added_date >= "${startDate}" AND added_date < "${endDate}"
        GROUP BY DATE(DATE_FORMAT(added_date, '%Y-%m-01'))
        ORDER BY DATE(DATE_FORMAT(added_date, '%Y-%m-01'))
        `;
        break;
      // case "quarter":
      //   query = `
      //   SELECT DATE(CONCAT(YEAR(added_date),'-', 1 + 3*(QUARTER(added_date)-1),'-01')) AS quarter_beginning,
      //     SUM(net_total) AS net_total,
      //     SUM(payed_amount) AS payed_amount,
      //     COUNT(*) AS transactions
      //   FROM customer_invoice
      //   WHERE added_date >= "${startDate}" AND added_date <= "${endDate}"
      //   GROUP BY DATE(CONCAT(YEAR(added_date),'-', 1 + 3*(QUARTER(added_date)-1),'-01'))
      //   ORDER BY DATE(CONCAT(YEAR(added_date),'-', 1 + 3*(QUARTER(added_date)-1),'-01'))
      //     `;
      //   break;
      case "year":
        endDate = moment(end).add(1, "year").format("YYYY-MM-DD");
        query = `
        SELECT YEAR(added_date) as year,
	        SUM(net_total) AS net_total,
          SUM(payed_amount) AS payed_amount,
          COUNT(*) AS transactions
          FROM customer_invoice
          WHERE added_date >= "${startDate}" AND added_date <= "${endDate}"
          GROUP BY YEAR(added_date)
      `;
      default:
        break;
    }

    const rawResults = await getRepository(CustomerInvoice).query(query).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      };
    });

    return {
      status: true,
      data: rawResults
    };
  }

}