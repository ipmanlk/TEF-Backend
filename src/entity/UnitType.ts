import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrnMaterial } from "./GrnMaterial";
import { Material } from "./Material";
import { MaterialAnalysis } from "./MaterialAnalysis";
import { Product } from "./Product";
import { ProductPackage } from "./ProductPackage";
import { PurchaseOrderMaterial } from "./PurchaseOrderMaterial";
import { QuotationMaterial } from "./QuotationMaterial";

@Entity("unit_type", { schema: "twoelephantsfireworks" })
export class UnitType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => GrnMaterial, (grnMaterial) => grnMaterial.unitType)
  grnMaterials: GrnMaterial[];

  @OneToMany(() => Material, (material) => material.unitType)
  materials: Material[];

  @OneToMany(
    () => MaterialAnalysis,
    (materialAnalysis) => materialAnalysis.unitType
  )
  materialAnalyses: MaterialAnalysis[];

  @OneToMany(() => Product, (product) => product.unitType)
  products: Product[];

  @OneToMany(() => ProductPackage, (productPackage) => productPackage.unitType)
  productPackages: ProductPackage[];

  @OneToMany(
    () => PurchaseOrderMaterial,
    (purchaseOrderMaterial) => purchaseOrderMaterial.unitType
  )
  purchaseOrderMaterials: PurchaseOrderMaterial[];

  @OneToMany(
    () => QuotationMaterial,
    (quotationMaterial) => quotationMaterial.unitType
  )
  quotationMaterials: QuotationMaterial[];
}
