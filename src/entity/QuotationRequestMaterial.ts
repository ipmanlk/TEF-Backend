import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Material } from "./Material";
import { QuotationRequest } from "./QuotationRequest";

@Index("fk_quotation_request_has_material_material1_idx", ["materialId"], {})
@Index(
  "fk_quotation_request_has_material_quotation_request1_idx",
  ["quotationRequestId"],
  {}
)
@Entity("quotation_request_material", { schema: "twoelephantsfireworks" })
export class QuotationRequestMaterial {
  @Column("int", { primary: true, name: "quotation_request_id" })
  quotationRequestId: number;

  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("tinyint", { name: "requested", width: 1 })
  requested: boolean;

  @Column("tinyint", { name: "accepted", nullable: true, width: 1 })
  accepted: boolean | null;

  @Column("tinyint", { name: "received", nullable: true, width: 1 })
  received: boolean | null;

  @ManyToOne(() => Material, (material) => material.quotationRequestMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(
    () => QuotationRequest,
    (quotationRequest) => quotationRequest.quotationRequestMaterials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "quotation_request_id", referencedColumnName: "id" }])
  quotationRequest: QuotationRequest;
}
