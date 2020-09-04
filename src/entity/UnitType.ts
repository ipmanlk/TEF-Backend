import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./Material";
import { MaterialAnalysis } from "./MaterialAnalysis";
import { Product } from "./Product";
import { ProductPackage } from "./ProductPackage";
import { QuotationMaterial } from "./QuotationMaterial";

@Entity("unit_type", { schema: "twoelephantsfireworks" })
export class UnitType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

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
    () => QuotationMaterial,
    (quotationMaterial) => quotationMaterial.unitType
  )
  quotationMaterials: QuotationMaterial[];
}
