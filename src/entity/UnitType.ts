import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./Material";
import { Product } from "./Product";
import { ProductPackage } from "./ProductPackage";

@Entity("unit_type", { schema: "twoelephantsfireworks" })
export class UnitType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Material, (material) => material.unitType)
  materials: Material[];

  @OneToMany(() => Product, (product) => product.unitType)
  products: Product[];

  @OneToMany(() => ProductPackage, (productPackage) => productPackage.unitType)
  productPackages: ProductPackage[];
}
