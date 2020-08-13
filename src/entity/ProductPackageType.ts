import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductPackage } from "./ProductPackage";

@Entity("product_package_type", { schema: "twoelephantsfireworks" })
export class ProductPackageType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => ProductPackage,
    (productPackage) => productPackage.productPackageType
  )
  productPackages: ProductPackage[];
}
