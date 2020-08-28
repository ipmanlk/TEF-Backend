import { getRepository } from "typeorm";
import { Supplier } from "../entity/Supplier";
import { SupplierMaterialDao } from "../dao/SupplierMaterialDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { MiscUtil } from "../util/MiscUtil";
import { Material } from "../entity/Material";

export class SupplierMaterialController {

    static async getMaterials(supplierId: number) {
        const supplierMats = await SupplierMaterialDao.getMaterials(supplierId).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: supplierMats
        };
    }

    static async update(data) {
        try {
            // find the correct supplier
            const supplier = await getRepository(Supplier).findOne(data.supplierId);
            // get materials for given ids
            const materials = await getRepository(Material).findByIds(data.materialIds);
            // set supplier materials
            supplier.materials = materials;
            await getRepository(Supplier).save(supplier);
            return {
                status: true,
                msg: "Supplier materials have been updated succesfully!."
            }
        } catch (e) {
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }
}