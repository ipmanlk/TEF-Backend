import { getRepository } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice";
import * as moment from "moment";

export class ReportController {
	/**
	 * Sales Report
	 */

	static async getSalesReport({ start, end, type }) {
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

		const rawResults = await getRepository(CustomerInvoice)
			.query(query)
			.catch((e) => {
				console.log(e.code, e);
				throw {
					status: false,
					type: "server",
					msg: "Server Error!. Please check logs.",
				};
			});

		return {
			status: true,
			data: rawResults,
		};
	}

	static async getDemandReport({ start, end, type }) {
		let startDate = moment(start).format("YYYY-MM-DD");
		let endDate = moment(end).format("YYYY-MM-DD");

		// get invoices with product pkgs between given time frame
		const invoices = await getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.select(["ci.id", "ci.code", "ci.addedDate"])
			.leftJoinAndSelect("ci.customerInvoiceProductPackages", "cipkg")
			.leftJoin("cipkg.productPackage", "pkg")
			.addSelect(["pkg.id", "pkg.name", "pkg.code"])
			.where("ci.addedDate >= :start AND ci.addedDate <= :end", {
				start: startDate,
				end: endDate,
			})
			.getMany();

		// store requested product pkg amounts
		const requestedProductPkgs = [];

		invoices.forEach((i) => {
			// loop through each product pkg in invoice
			i.customerInvoiceProductPackages.forEach((ciPkg) => {
				// relevant product pkg
				const pkg = ciPkg.productPackage;

				requestedProductPkgs.push({
					id: pkg.id,
					date: i.addedDate,
					qty: ciPkg.requestedQty,
					code: pkg.code,
					name: pkg.name,
				});
			});
		});

		// group based on given type
		let responseData;

		switch (type) {
			case "day":
				const dayGroups = {};

				requestedProductPkgs.forEach((pkg) => {
					const date = pkg.date;
					// if there are records in day groups for this date
					if (dayGroups[date]) {
						// if pkg is already listed under the date
						if (dayGroups[date][pkg.id]) {
							dayGroups[date][pkg.id].qty += pkg.qty;
						} else {
							dayGroups[date][pkg.id] = pkg;
						}
					} else {
						// add new date to day group
						const data = {};
						data[pkg.id] = pkg;
						dayGroups[date] = data;
					}
				});

				responseData = dayGroups;
				break;

			case "month":
				const monthGroups = {};

				requestedProductPkgs.forEach((pkg) => {
					const month = moment(pkg.date).format("YYYY-MM");
					delete pkg.date;
					if (monthGroups[month]) {
						if (monthGroups[month][pkg.id]) {
							monthGroups[month][pkg.id].qty += pkg.qty;
						} else {
							monthGroups[month][pkg.id] = pkg;
						}
					} else {
						const data = {};
						data[pkg.id] = pkg;
						monthGroups[month] = data;
					}
				});

				responseData = monthGroups;
				break;

			case "year":
				const yearGroups = {};

				requestedProductPkgs.forEach((pkg) => {
					const year = moment(pkg.date).format("YYYY");
					delete pkg.date;
					if (yearGroups[year]) {
						if (yearGroups[year][pkg.id]) {
							yearGroups[year][pkg.id].qty += pkg.qty;
						} else {
							yearGroups[year][pkg.id] = pkg;
						}
					} else {
						const data = {};
						data[pkg.id] = pkg;
						yearGroups[year] = data;
					}
				});

				responseData = yearGroups;
				break;

			default:
				responseData = [];
				break;
		}

		return {
			status: true,
			data: responseData,
		};
	}
}
