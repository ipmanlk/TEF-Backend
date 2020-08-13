import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { ProductPackageStatus } from "./ProductPackageStatus";
import { ProductPackageType } from "./ProductPackageType";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("fk_item_package_product1_idx", ["productId"], {})
@Index(
  "fk_product_package_product_package_status1_idx",
  ["productPackageStatusId"],
  {}
)
@Index(
  "fk_product_package_product_package_type1_idx",
  ["productPackageTypeId"],
  {}
)
@Entity("product_package", { schema: "twoelephantsfireworks" })
export class ProductPackage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("char", { name: "code", unique: true, length: 12 })
  code: string;

  @Column("decimal", { name: "price", nullable: true, precision: 9, scale: 2 })
  price: string | null;

  @Column("decimal", {
    name: "sale_price",
    nullable: true,
    precision: 9,
    scale: 2,
  })
  salePrice: string | null;

  @Column("mediumblob", { name: "photo", nullable: true })
  photo: Buffer | null;

  @Column("int", { name: "pieces", nullable: true })
  pieces: number | null;

  @Column("int", { name: "rop", nullable: true })
  rop: number | null;

  @Column("varchar", { name: "weight", nullable: true, length: 45 })
  weight: string | null;

  @Column("date", { name: "added_date", nullable: true })
  addedDate: string | null;

  @Column("int", { name: "product_package_status_id" })
  productPackageStatusId: number;

  @Column("int", { name: "product_package_type_id" })
  productPackageTypeId: number;

  @ManyToOne(() => Product, (product) => product.productPackages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;

  @ManyToOne(
    () => ProductPackageStatus,
    (productPackageStatus) => productPackageStatus.productPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "product_package_status_id", referencedColumnName: "id" },
  ])
  productPackageStatus: ProductPackageStatus;

  @ManyToOne(
    () => ProductPackageType,
    (productPackageType) => productPackageType.productPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_type_id", referencedColumnName: "id" }])
  productPackageType: ProductPackageType;
}