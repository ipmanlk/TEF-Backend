import { getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { ProductStatus } from "../entity/ProductStatus";
import { ProductDao } from "../dao/ProductDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { MiscUtil } from "../util/MiscUtil";

export class ProductCostAnalysisController {
	static async getOne({ id }) {}

	static async update(data) {}

	static async delete({ id }) {}
}
