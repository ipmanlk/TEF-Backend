import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Grn } from "./Grn";
import { Material } from "./Material";
import { UnitType } from "./UnitType";

@Index("fk_grn_has_material_grn1_idx", ["grnId"], {})
@Index("fk_grn_has_material_material1_idx", ["materialId"], {})
@Index("fk_grn_material_unit_type1_idx", ["unitTypeId"], {})
@Entity("grn_material", { schema: "twoelephantsfireworks" })
export class GrnMaterial {
  @Column("int", { primary: true, name: "grn_id" })
  grnId: number;

  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("decimal", { name: "purchase_price", precision: 9, scale: 2 })
  purchasePrice: string;

  @Column("decimal", { name: "received_qty", precision: 9, scale: 2 })
  receivedQty: string;

  @Column("decimal", { name: "line_total", precision: 10, scale: 2 })
  lineTotal: string;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @ManyToOne(() => Grn, (grn) => grn.grnMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "grn_id", referencedColumnName: "id" }])
  grn: Grn;

  @ManyToOne(() => Material, (material) => material.grnMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(() => UnitType, (unitType) => unitType.grnMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}
