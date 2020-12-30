import { getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { ProductStatus } from "../entity/ProductStatus";
import { ProductDao } from "../dao/ProductDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { MiscUtil } from "../util/MiscUtil";
import { ProductPackageCostAnalysis } from "../entity/ProductPackageCostAnalysis";

export class ProductPackageCostAnalysisController {
	static async getOne({ productPackageId }) {
		try {
			const data = await getRepository(ProductPackageCostAnalysis).find({
				where: {
					productPackageId: productPackageId,
				},
			});

			return {
				status: true,
				data: data,
			};
		} catch (e) {
			console.log(e);
			return {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	static async update(data, session) {
		try {
			console.log(data);

			// remove existing records
			getRepository(ProductPackageCostAnalysis)
				.createQueryBuilder()
				.delete()
				.where("productPackageId = :id", { id: data.productPackageId })
				.execute();

			// insert new records
			for (let pd of data.salePriceData) {
				const record = {
					productPackageId: pd.productPackageId,
					validFrom: pd.validFrom,
					validTo: pd.validTo,
					materialCost: pd.materialCost,
					productionCost: pd.productionCost,
					totalCost: pd.totalCost,
					profitRatio: pd.profitRatio,
					salePrice: pd.salePrice,
					addedDate: pd.addedDate,
					employeeId: session.data.employeeId,
				};
				await getRepository(ProductPackageCostAnalysis).save(record);
			}

			return {
				status: true,
				msg: "Product package sale prices have been updated!.",
			};
		} catch (e) {
			console.log(e);
			return {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs.",
			};
		}
	}

	static async delete({ id }) {}
}
