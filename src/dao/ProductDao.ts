import { getRepository } from "typeorm";
import { Product } from "../entity/Product";

export class ProductDao {
    static search({ keyword = "", skip = 0, limit = 15 }) {
        if (limit !== 0) {
            return getRepository(Product)
                .createQueryBuilder("p")
                .select([
                    "p.id", "p.code", "p.name", "p.cost", "p.price"
                ])
                .leftJoinAndSelect("p.productStatus", "ps")
                .leftJoinAndSelect("p.category", "ca")
                .where("p.code LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("p.name LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("p.cost LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("p.price LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("ps.name LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("ca.name LIKE :keyword", { keyword: `%${keyword}%` })
                .skip(skip)
                .take(limit)
                .getMany()

        } else {
            return getRepository(Product)
                .createQueryBuilder("p")
                .select([
                    "p.id", "p.code", "p.name"
                ])
                .getMany()
        }
    }
}