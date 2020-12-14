import { getRepository, getConnection } from "typeorm";
import { Quotation } from "../entity/Quotation";
import { QuotationStatus } from "../entity/QuotationStatus";

export class QuotationDao {
	static async search({ keyword = "", skip = 0 }) {
		await this.checkQuotationStatus();

		return getRepository(Quotation)
			.createQueryBuilder("q")
			.leftJoinAndSelect("q.quotationRequest", "qr")
			.select([
				"q.id",
				"q.qnumber",
				"q.validFrom",
				"q.validTo",
				"qr.id",
				"qr.qrnumber",
			])
			.leftJoinAndSelect("q.quotationStatus", "qs")
			.where("q.qnumber LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("q.validFrom LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("q.validTo LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("qr.qrnumber LIKE :keyword", { keyword: `%${keyword}%` })
			.orWhere("qs.name LIKE :keyword", { keyword: `%${keyword}%` })
			.orderBy("q.qnumber", "DESC")
			.skip(skip)
			.take(15)
			.getMany();
	}

	static getOne(id) {
		return getRepository(Quotation)
			.createQueryBuilder("q")
			.leftJoinAndSelect("q.employee", "emp")
			.select([
				"q.id",
				"q.qnumber",
				"q.validFrom",
				"q.validTo",
				"q.description",
				"q.addedDate",
				"emp.id",
				"emp.number",
				"emp.callingName",
			])
			.leftJoinAndSelect("q.quotationStatus", "qs")
			.leftJoinAndSelect("q.quotationMaterials", "qm")
			.leftJoinAndSelect("qm.material", "qmm")
			.leftJoinAndSelect("qmm.unitType", "ut")
			.leftJoinAndSelect("q.quotationRequest", "qr")
			.leftJoinAndSelect("qr.supplier", "qrs")
			.leftJoinAndSelect("qrs.supplierType", "qrst")
			.where("q.id = :keyword", { keyword: id })
			.getOne();
	}

	// get quotations belong to a single supplier
	static async getSupplierQuotations(supplierId, quotationStatusName = "") {
		await this.checkQuotationStatus();

		return getRepository(Quotation)
			.createQueryBuilder("q")
			.leftJoin("q.quotationRequest", "qr")
			.leftJoinAndSelect("q.quotationStatus", "qs")
			.where("qr.supplierId = :supplierId", { supplierId: supplierId })
			.andWhere("qs.name LIKE :statusName", {
				statusName: quotationStatusName == "" ? "%%" : quotationStatusName,
			})
			.getMany();
	}

	private static async checkQuotationStatus() {
		// update quotation status on quotations
		const inactiveStatus = await getRepository(QuotationStatus).findOne({
			where: { name: "Inactive" },
		});
		const deletedStatus = await getRepository(QuotationStatus).findOne({
			where: { name: "Deleted" },
		});

		await getConnection()
			.createQueryBuilder()
			.update(Quotation)
			.set({
				quotationStatus: inactiveStatus,
			})
			.where("validTo < :date", { date: new Date() })
			.andWhere("quotationStatusId <> :statusId", {
				statusId: deletedStatus.id,
			})
			.execute();
	}
}
