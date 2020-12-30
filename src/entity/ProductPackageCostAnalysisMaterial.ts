import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Material } from "./Material";
import { ProductPackageCostAnalysis } from "./ProductPackageCostAnalysis";
import { UnitType } from "./UnitType";

@Index(
  "fk_product_package_cost_analysis_has_material_material1_idx",
  ["materialId"],
  {}
)
@Index(
  "fk_product_package_cost_analysis_has_material_product_packa_idx",
  ["productPackageCostAnalysisId"],
  {}
)
@Index(
  "fk_product_package_cost_analysis_material_unit_type1_idx",
  ["unitTypeId"],
  {}
)
@Entity("product_package_cost_analysis_material", {
  schema: "twoelephantsfireworks",
})
export class ProductPackageCostAnalysisMaterial {
  @Column("int", { primary: true, name: "product_package_cost_analysis_id" })
  productPackageCostAnalysisId: number;

  @Column("int", { primary: true, name: "material_id" })
  materialId: number;

  @Column("decimal", { name: "qty", precision: 10, scale: 2 })
  qty: string;

  @Column("decimal", { name: "unit_price", precision: 8, scale: 2 })
  unitPrice: string;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @ManyToOne(
    () => Material,
    (material) => material.productPackageCostAnalysisMaterials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(
    () => ProductPackageCostAnalysis,
    (productPackageCostAnalysis) =>
      productPackageCostAnalysis.productPackageCostAnalysisMaterials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "product_package_cost_analysis_id", referencedColumnName: "id" },
  ])
  productPackageCostAnalysis: ProductPackageCostAnalysis;

  @ManyToOne(
    () => UnitType,
    (unitType) => unitType.productPackageCostAnalysisMaterials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}
