import { getRepository } from "typeorm";
import { QuotationRequest } from "../entity/QuotationRequest";
import { QuotationRequestMaterial } from "../entity/QuotationRequestMaterial";
import { MiscUtil } from "../util/MiscUtil";

export class QuotationRequestController {

  static async save(data, session) {

    // create quatation request number
    const lastEntry = await getRepository(QuotationRequest).findOne({
      select: ["id", "qrnumber"],
      order: { id: "DESC" }
    });

    // set code for new material
    if (lastEntry) {
      data.qrnumber = MiscUtil.getNextNumber("QRN", lastEntry.qrnumber, 5);
    } else {
      data.qrnumber = MiscUtil.getNextNumber("QRN", undefined, 5);
    }

    // create an quatation request object
    const quatationRequest = data as QuotationRequest;

    // set created employee
    quatationRequest.employeeId = session.data.employeeId;

    // save entry
    const entry = await getRepository(QuotationRequest).save(quatationRequest).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // set empty array for quatation request material
    const requestMaterials = [];
    data.requestMaterials.forEach(rm => {
      const requestMaterial = new QuotationRequestMaterial();
      requestMaterial.quotationRequest = entry;
      requestMaterial.materialId = rm.materialId;
      requestMaterial.requested = rm.requested;
      requestMaterial.accepted = rm.accepted;
      requestMaterial.received = rm.received;
      requestMaterials.push(requestMaterial);
    });

    // save request materials
    await getRepository(QuotationRequestMaterial).save(requestMaterials).catch(e => {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: { qrnumber: entry.qrnumber },
      msg: "Quotation request has been created!"
    };
  }
}