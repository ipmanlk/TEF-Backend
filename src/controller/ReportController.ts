import { getRepository } from "typeorm";
import { CustomerInvoice } from "../entity/CustomerInvoice";
import * as moment from "moment";
import { ProductionInventoryUpdate } from "../entity/ProductionInventoryUpdate";
import { MaterialAnalysis } from "../entity/MaterialAnalysis";

export class ReportController {
	/**
	 * Sales Report
	 */

	static async getSalesReport({ start, end, type }) {
		let startDate = moment(start).format("YYYY-MM-DD");
		let endDate;

		// change end to get data inclusively (with end)
		if (type == "month") {
			endDate = moment(end)
				.add(1, "months")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else if (type == "year") {
			endDate = moment(end)
				.add(1, "years")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else {
			endDate = moment(end).format("YYYY-MM-DD");
		}

		// get invoices between given time frame
		const invoices = await getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.where("ci.addedDate >= :start AND ci.addedDate <= :end", {
				start: startDate,
				end: endDate,
			})
			.orderBy("ci.addedDate", "ASC")
			.getMany();

		// used within switch case for startDate and endDate
		let stDate, edDate;

		let responseData;

		switch (type) {
			case "today":
				const todayGroup = {};

				invoices.forEach((i) => {
					const date = i.addedDate;
					if (todayGroup[date]) {
						todayGroup[date].transactions++;
						todayGroup[date].payedAmount += parseFloat(i.payedAmount);
						todayGroup[date].netTotal += parseFloat(i.netTotal);
					} else {
						todayGroup[date] = {
							transactions: 1,
							payedAmount: parseFloat(i.payedAmount),
							netTotal: parseFloat(i.netTotal),
						};
					}
				});

				responseData = todayGroup;
				break;

			case "day":
				const dayGroups = {};
				// add all days in duration (even no sale days should be present)
				stDate = startDate;
				edDate = endDate;

				while (stDate !== edDate) {
					dayGroups[stDate] = null;
					stDate = moment(stDate).add("1", "days").format("YYYY-MM-DD");
				}

				// fill with data
				invoices.forEach((i) => {
					const date = i.addedDate;
					if (dayGroups[date]) {
						dayGroups[date].transactions++;
						dayGroups[date].payedAmount += parseFloat(i.payedAmount);
						dayGroups[date].netTotal += parseFloat(i.netTotal);
					} else {
						dayGroups[date] = {
							transactions: 1,
							payedAmount: parseFloat(i.payedAmount),
							netTotal: parseFloat(i.netTotal),
						};
					}
				});

				responseData = dayGroups;
				break;

			case "month":
				const monthGroups = {};
				// add all months in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY-MM");
				edDate = moment(endDate).add("1", "months").format("YYYY-MM");

				while (stDate !== edDate) {
					monthGroups[stDate] = null;
					stDate = moment(stDate).add("1", "months").format("YYYY-MM");
				}

				// fill with data
				invoices.forEach((i) => {
					const date = moment(i.addedDate).format("YYYY-MM");
					if (monthGroups[date]) {
						monthGroups[date].transactions++;
						monthGroups[date].payedAmount += parseFloat(i.payedAmount);
						monthGroups[date].netTotal += parseFloat(i.netTotal);
					} else {
						monthGroups[date] = {
							transactions: 1,
							payedAmount: parseFloat(i.payedAmount),
							netTotal: parseFloat(i.netTotal),
						};
					}
				});

				responseData = monthGroups;
				break;

			case "year":
				const yearGroups = {};
				// add all years in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY");
				edDate = moment(endDate).format("YYYY");

				while (stDate !== edDate) {
					yearGroups[stDate] = null;
					stDate = moment(stDate).add(1, "years").format("YYYY");
				}

				// fill with data
				invoices.forEach((i) => {
					const year = moment(i.addedDate).format("YYYY");
					if (yearGroups[year]) {
						yearGroups[year].transactions++;
						yearGroups[year].payedAmount += parseFloat(i.payedAmount);
						yearGroups[year].netTotal += parseFloat(i.netTotal);
					} else {
						yearGroups[year] = {
							transactions: 1,
							payedAmount: parseFloat(i.payedAmount),
							netTotal: parseFloat(i.netTotal),
						};
					}
				});

				responseData = yearGroups;
				break;

			default:
				responseData = {};
				break;
		}

		return {
			status: true,
			data: responseData,
		};
	}

	static async getDemandReport({ start, end, type }) {
		let startDate = moment(start).format("YYYY-MM-DD");
		let endDate = moment(end).format("YYYY-MM-DD");

		// change end to get data inclusively (with end)
		if (type == "month") {
			endDate = moment(end)
				.add(1, "months")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else if (type == "year") {
			endDate = moment(end)
				.add(1, "years")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else {
			endDate = moment(end).format("YYYY-MM-DD");
		}

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
			.orderBy("ci.addedDate", "ASC")
			.getMany();

		// store requested product pkg amounts
		const requestedProductPkgs = [];

		invoices.forEach((i) => {
			// loop through each product pkg in invoice
			i.customerInvoiceProductPackages.forEach((ciPkg) => {
				// get relevant product pkg
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
				responseData = {};
				break;
		}

		// convert response data to ui friendly format
		const formattedResponseData = {};

		Object.keys(responseData).forEach((i) => {
			formattedResponseData[i] = Object.values(responseData[i]);
		});

		return {
			status: true,
			data: formattedResponseData,
		};
	}

	static async getProductionCostReport({ start, end, type }) {
		let startDate = moment(start).format("YYYY-MM-DD");
		let endDate = moment(end).format("YYYY-MM-DD");

		// change end to get data inclusively (with end)
		if (type == "month") {
			endDate = moment(end)
				.add(1, "months")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else if (type == "year") {
			endDate = moment(end)
				.add(1, "years")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else {
			endDate = moment(end).format("YYYY-MM-DD");
		}

		// get production updates happened during given time period
		const productionUpdates = await getRepository(ProductionInventoryUpdate)
			.createQueryBuilder("piu")
			.leftJoin("piu.productPackage", "pkg")
			.addSelect(["pkg.id", "pkg.productId", "pkg.pieces"])
			.where("piu.addedDate >= :start AND piu.addedDate <= :end", {
				start: startDate,
				end: endDate,
			})
			.orderBy("piu.addedDate", "ASC")
			.getMany();

		// store material analysis data for later use. productId: [] format
		const materialAnalysisData = {};

		for (let i of productionUpdates) {
			const materialAnalysis = await getRepository(MaterialAnalysis)
				.createQueryBuilder("ma")
				.leftJoin("ma.material", "mat")
				.addSelect(["mat.id", "mat.name", "mat.code", "mat.unitPrice"])
				.where("ma.productId = :productId", {
					productId: i.productPackage.productId,
				})
				.getMany();
			materialAnalysisData[i.productPackage.productId] = materialAnalysis;
		}

		/**
		 * Part 1: Get overall material cost
		 */

		const materialCosts = {};

		// calculate cost per each material based production inv updates
		productionUpdates.forEach((i) => {
			const productId = i.productPackage.productId;
			const productQty = i.productPackage.pieces;

			const materials = materialAnalysisData[productId];

			materials.forEach((ma) => {
				const materialId = ma.material.id;
				const unitPrice = parseFloat(ma.material.unitPrice);
				const amount = parseFloat(ma.amount);

				if (materialCosts[materialId]) {
					materialCosts[materialId]["cost"] += unitPrice * amount * productQty;
				} else {
					materialCosts[materialId] = {
						material: ma.material,
						cost: unitPrice * amount * productQty,
					};
				}
			});
		});

		/**
		 * Part 2: Cost based on each time period
		 */

		// add cost to each production inventory update
		for (let i of productionUpdates) {
			// add production cost attribute to production update
			i["productionCost"] = 0;

			// get materials needed for a single product
			const materialAnalysis = materialAnalysisData[i.productPackage.productId];

			materialAnalysis.forEach((matData) => {
				// how many products are in current product pkg
				const productQty = i.productPackage.pieces;
				// required materials cost
				const matCost =
					parseFloat(matData.material.unitPrice) *
					parseFloat(matData.amount) *
					productQty;
				// add to material costs
				i["productionCost"] += matCost;
			});
		}

		/**
		 * Format data for each time period
		 */

		let timePeriodData, stDate, edDate;

		switch (type) {
			case "today":
				const todayGroup = {};

				productionUpdates.forEach((i) => {
					const date = i.addedDate;
					if (todayGroup[date]) {
						todayGroup[date] += parseFloat(i["productionCost"]);
					} else {
						todayGroup[date] = parseFloat(i["productionCost"]);
					}
				});

				timePeriodData = todayGroup;
				break;

			case "day":
				const dayGroups = {};
				// add all days in duration (even no sale days should be present)
				stDate = startDate;
				edDate = endDate;

				while (stDate !== edDate) {
					dayGroups[stDate] = null;
					stDate = moment(stDate).add("1", "days").format("YYYY-MM-DD");
				}

				// fill with data
				productionUpdates.forEach((i) => {
					const date = i.addedDate;
					if (dayGroups[date]) {
						dayGroups[date] += parseFloat(i["productionCost"]);
					} else {
						dayGroups[date] = parseFloat(i["productionCost"]);
					}
				});

				timePeriodData = dayGroups;
				break;

			case "month":
				const monthGroups = {};
				// add all months in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY-MM");
				edDate = moment(endDate).add("1", "months").format("YYYY-MM");

				while (stDate !== edDate) {
					monthGroups[stDate] = null;
					stDate = moment(stDate).add("1", "months").format("YYYY-MM");
				}

				// fill with data
				productionUpdates.forEach((i) => {
					const date = moment(i.addedDate).format("YYYY-MM");
					if (monthGroups[date]) {
						monthGroups[date] += parseFloat(i["productionCost"]);
					} else {
						monthGroups[date] = parseFloat(i["productionCost"]);
					}
				});

				timePeriodData = monthGroups;
				break;

			case "year":
				const yearGroups = {};
				// add all years in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY");
				edDate = moment(endDate).format("YYYY");

				while (stDate !== edDate) {
					yearGroups[stDate] = null;
					stDate = moment(stDate).add(1, "years").format("YYYY");
				}

				// fill with data
				productionUpdates.forEach((i) => {
					const date = moment(i.addedDate).format("YYYY");
					if (yearGroups[date]) {
						yearGroups[date] += parseFloat(i["productionCost"]);
					} else {
						yearGroups[date] = parseFloat(i["productionCost"]);
					}
				});

				timePeriodData = yearGroups;
				break;

			default:
				timePeriodData = {};
				break;
		}

		return {
			status: true,
			data: {
				timePeriodData: timePeriodData,
				materialCosts: Object.values(materialCosts),
			},
		};
	}

	static async getRevenueReport({ start, end, type }) {
		let startDate = moment(start).format("YYYY-MM-DD");
		let endDate;

		// change end to get data inclusively (with end)
		if (type == "month") {
			endDate = moment(end)
				.add(1, "months")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else if (type == "year") {
			endDate = moment(end)
				.add(1, "years")
				.subtract(1, "days")
				.format("YYYY-MM-DD");
		} else {
			endDate = moment(end).format("YYYY-MM-DD");
		}

		// get invoices between given time frame
		const invoices = await getRepository(CustomerInvoice)
			.createQueryBuilder("ci")
			.leftJoinAndSelect("ci.customerInvoiceProductPackages", "cipkg")
			.leftJoinAndSelect("cipkg.productPackage", "pkg")
			.where("ci.addedDate >= :start AND ci.addedDate <= :end", {
				start: startDate,
				end: endDate,
			})
			.orderBy("ci.addedDate", "ASC")
			.getMany();

		// add revenue to each invoice
		invoices.forEach((i) => {
			let revenue = 0;
			i.customerInvoiceProductPackages.forEach((ciPkg) => {
				const rev =
					(parseFloat(ciPkg.productPackage.salePrice) -
						parseFloat(ciPkg.productPackage.price)) *
					ciPkg.deliveredQty;
				revenue += rev;
			});
			i["revenue"] = revenue;
		});

		// used within switch case for startDate and endDate
		let stDate, edDate;

		let responseData;

		switch (type) {
			case "today":
				const todayGroup = {};

				invoices.forEach((i) => {
					const date = i.addedDate;
					if (todayGroup[date]) {
						todayGroup[date].transactions++;
						todayGroup[date].revenue += parseFloat(i["revenue"]);
					} else {
						todayGroup[date] = {
							transactions: 1,
							revenue: parseFloat(i["revenue"]),
						};
					}
				});

				responseData = todayGroup;
				break;

			case "day":
				const dayGroups = {};
				// add all days in duration (even no sale days should be present)
				stDate = startDate;
				edDate = endDate;

				while (stDate !== edDate) {
					dayGroups[stDate] = null;
					stDate = moment(stDate).add("1", "days").format("YYYY-MM-DD");
				}

				// fill with data
				invoices.forEach((i) => {
					const date = i.addedDate;
					if (dayGroups[date]) {
						dayGroups[date].transactions++;
						dayGroups[date].revenue += parseFloat(i["revenue"]);
					} else {
						dayGroups[date] = {
							transactions: 1,
							revenue: parseFloat(i["revenue"]),
						};
					}
				});

				responseData = dayGroups;
				break;

			case "month":
				const monthGroups = {};
				// add all months in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY-MM");
				edDate = moment(endDate).add("1", "months").format("YYYY-MM");

				while (stDate !== edDate) {
					monthGroups[stDate] = null;
					stDate = moment(stDate).add("1", "months").format("YYYY-MM");
				}

				// fill with data
				invoices.forEach((i) => {
					const date = moment(i.addedDate).format("YYYY-MM");
					if (monthGroups[date]) {
						monthGroups[date].transactions++;
						monthGroups[date].revenue += parseFloat(i["revenue"]);
					} else {
						monthGroups[date] = {
							transactions: 1,
							revenue: parseFloat(i["revenue"]),
						};
					}
				});

				responseData = monthGroups;
				break;

			case "year":
				const yearGroups = {};
				// add all years in duration (even no sale days should be present)
				stDate = moment(startDate).format("YYYY");
				edDate = moment(endDate).format("YYYY");

				while (stDate !== edDate) {
					yearGroups[stDate] = null;
					stDate = moment(stDate).add(1, "years").format("YYYY");
				}

				// fill with data
				invoices.forEach((i) => {
					const year = moment(i.addedDate).format("YYYY");
					if (yearGroups[year]) {
						yearGroups[year].transactions++;
						yearGroups[year].revenue += parseFloat(i["revenue"]);
					} else {
						yearGroups[year] = {
							transactions: 1,
							revenue: parseFloat(i["revenue"]),
						};
					}
				});

				responseData = yearGroups;
				break;

			default:
				responseData = {};
				break;
		}

		return {
			status: true,
			data: responseData,
		};
	}
}
