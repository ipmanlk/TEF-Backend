import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UnitType } from "./UnitType";
import { Material } from "./Material";
import { Product } from "./Product";

@Index("fk_product_has_material_material1_idx", ["materialId"], {})
@Index("fk_product_has_material_product1_idx", ["productId"], {})
@Index("fk_material_analysis_unit_type1_idx", ["unitTypeId"], {})
@Entity("material_analysis", { schema: "twoelephantsfireworks" })
export class MaterialAnalysis {
  @Column("int", { primary: true, name: "product_id" })
  productId: number;

  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("decimal", { name: "amount", precision: 7, scale: 2 })
  amount: string;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @ManyToOne(() => UnitType, (unitType) => unitType.materialAnalyses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;

  @ManyToOne(() => Material, (material) => material.materialAnalyses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(() => Product, (product) => product.materialAnalyses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;
}
