import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Material } from "./Material";
import { Quotation } from "./Quotation";
import { UnitType } from "./UnitType";

@Index("fk_material_has_quotation_quotation1_idx", ["quotationId"], {})
@Index("fk_material_has_quotation_material1_idx", ["materialId"], {})
@Index("fk_quotation_material_unit_type1_idx", ["unitTypeId"], {})
@Entity("quotation_material", { schema: "twoelephantsfireworks" })
export class QuotationMaterial {
  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("int", { primary: true, name: "quotation_id" })
  quotationId: number;

  @Column("decimal", { name: "purchase_price", precision: 7, scale: 2 })
  purchasePrice: string;

  @Column("decimal", {
    name: "available_qty",
    nullable: true,
    precision: 7,
    scale: 2,
  })
  availableQty: string | null;

  @Column("decimal", {
    name: "minimum_request_qty",
    nullable: true,
    precision: 7,
    scale: 2,
  })
  minimumRequestQty: string | null;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @ManyToOne(() => Material, (material) => material.quotationMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(() => Quotation, (quotation) => quotation.quotationMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "quotation_id", referencedColumnName: "id" }])
  quotation: Quotation;

  @ManyToOne(() => UnitType, (unitType) => unitType.quotationMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}
