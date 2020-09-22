import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Material } from "./Material";
import { PurchaseOrder } from "./PurchaseOrder";
import { UnitType } from "./UnitType";

@Index("fk_purchase_order_has_material_material1_idx", ["materialId"], {})
@Index(
  "fk_purchase_order_has_material_purchase_order1_idx",
  ["purchaseOrderId"],
  {}
)
@Index("fk_purchase_order_material_unit_type1_idx", ["unitTypeId"], {})
@Entity("purchase_order_material", { schema: "twoelephantsfireworks" })
export class PurchaseOrderMaterial {
  @Column("int", { primary: true, name: "purchase_order_id" })
  purchaseOrderId: number;

  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("decimal", { name: "purchase_price", precision: 7, scale: 2 })
  purchasePrice: string;

  @Column("decimal", { name: "qty", precision: 7, scale: 2 })
  qty: string;

  @Column("decimal", { name: "line_total", precision: 8, scale: 2 })
  lineTotal: string;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @ManyToOne(() => Material, (material) => material.purchaseOrderMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.purchaseOrderMaterials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "purchase_order_id", referencedColumnName: "id" }])
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => UnitType, (unitType) => unitType.purchaseOrderMaterials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}
