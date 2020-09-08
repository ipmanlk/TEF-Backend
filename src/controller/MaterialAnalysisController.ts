import { getRepository } from "typeorm";
import { MaterialAnalysis } from "../entity/MaterialAnalysis";

export class MaterialAnalysisController {

  static async getOne(productId) {

    // find material details for given product
    const materialInfo = await getRepository(MaterialAnalysis).find({
      where: { productId: productId },
      relations: ["unitType", "material"]
    }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      };
    });

    // extract useful data
    const productMaterials = materialInfo.map(m => {
      return {
        material: {
          id: m.material.id,
          code: m.material.code,
          name: m.material.name
        },
        amount: m.amount,
        unitType: m.unitType
      }
    })

    return {
      status: true,
      data: productMaterials
    }
  }

  static async update(data) {
    // remove existing records
    await getRepository(MaterialAnalysis).createQueryBuilder()
      .delete()
      .where("productId = :id", { id: data.productId })
      .execute()
      .catch(e => {
        console.log(e.code, e);
        throw {
          status: false,
          type: "server",
          msg: "Server Error!. Please check logs."
        };
      });

    try {
      // save product mateirals
      for (let pm of data.productMaterials) {
        await getRepository(MaterialAnalysis).save({ ...pm, productId: data.productId });
      }

      return {
        status: true,
        msg: "Product materials have been updated!"
      };
    } catch (e) {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    }
  }
}