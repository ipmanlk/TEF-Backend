import { getRepository } from "typeorm";
import { Supplier } from "../entity/Supplier";

export class SupplierMaterialDao {
    static getMaterials(supplierId: number) {
        return getRepository(Supplier)
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.materials", "sm")
            .select([
                "s.id", "s.code", "sm.id"
            ])
            .where("s.id = :keyword", { keyword: supplierId })
            .getOne()
    }
}