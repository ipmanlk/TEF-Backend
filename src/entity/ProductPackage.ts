import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerInvoiceProductPackage } from "./CustomerInvoiceProductPackage";
import { CustomerOrderProductPackage } from "./CustomerOrderProductPackage";
import { Product } from "./Product";
import { ProductionOrderProductPackage } from "./ProductionOrderProductPackage";
import { ProductPackageStatus } from "./ProductPackageStatus";
import { ProductPackageType } from "./ProductPackageType";
import { UnitType } from "./UnitType";

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
@Index("fk_product_package_unit_type1_idx", ["unitTypeId"], {})
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

  @Column("decimal", { name: "weight", nullable: true, precision: 7, scale: 3 })
  weight: string | null;

  @Column("date", { name: "added_date", nullable: true })
  addedDate: string | null;

  @Column("int", { name: "product_package_status_id" })
  productPackageStatusId: number;

  @Column("int", { name: "product_package_type_id" })
  productPackageTypeId: number;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @OneToMany(
    () => CustomerInvoiceProductPackage,
    (customerInvoiceProductPackage) =>
      customerInvoiceProductPackage.productPackage
  )
  customerInvoiceProductPackages: CustomerInvoiceProductPackage[];

  @OneToMany(
    () => CustomerOrderProductPackage,
    (customerOrderProductPackage) => customerOrderProductPackage.productPackage
  )
  customerOrderProductPackages: CustomerOrderProductPackage[];

  @ManyToOne(() => Product, (product) => product.productPackages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;

  @OneToMany(
    () => ProductionOrderProductPackage,
    (productionOrderProductPackage) =>
      productionOrderProductPackage.productPackage
  )
  productionOrderProductPackages: ProductionOrderProductPackage[];

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

  @ManyToOne(() => UnitType, (unitType) => unitType.productPackages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}
