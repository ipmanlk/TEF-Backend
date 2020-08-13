import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductPackage } from "./ProductPackage";

@Entity("product_package_status", { schema: "twoelephantsfireworks" })
export class ProductPackageStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => ProductPackage,
    (productPackage) => productPackage.productPackageStatus
  )
  productPackages: ProductPackage[];
}
