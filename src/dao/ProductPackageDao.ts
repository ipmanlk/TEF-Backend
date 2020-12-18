import { getRepository } from "typeorm";
import { ProductPackage } from "../entity/ProductPackage";

export class ProductPackageDao {
	static search({ keyword = "", skip = 0, limit = 15 }) {
		if (limit != 0) {
			return getRepository(ProductPackage)
				.createQueryBuilder("pkg")
				.leftJoinAndSelect("pkg.product", "p")
				.select([
					"pkg.id",
					"pkg.code",
					"pkg.name",
					"pkg.price",
					"pkg.salePrice",
					"pkg.pieces",
				])
				.leftJoinAndSelect("pkg.productPackageStatus", "pkgst")
				.leftJoinAndSelect("pkg.productPackageType", "pkgty")
				.where("pkg.code LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkg.name LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkg.price LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkg.salePrice LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkg.pieces LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("p.code LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("p.name LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkgst.name LIKE :keyword", { keyword: `%${keyword}%` })
				.orWhere("pkgty.name LIKE :keyword", { keyword: `%${keyword}%` })
				.skip(skip)
				.take(limit)
				.getMany();
		} else {
			return getRepository(ProductPackage)
				.createQueryBuilder("pkg")
				.leftJoin("pkg.productPackageStatus", "pkgst")
				.select(["pkg.id", "pkg.code", "pkg.name"])
				.where("pkgst.name = :name", { name: "Available" })
				.getMany();
		}
	}
}
