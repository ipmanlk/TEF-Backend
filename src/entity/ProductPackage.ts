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
import { ProductPackageStatus } from "./ProductPackageStatus";
import { ProductPackageType } from "./ProductPackageType";
import { UnitType } from "./UnitType";
import { ProductPackageCostAnalysis } from "./ProductPackageCostAnalysis";
import { ProductionInventory } from "./ProductionInventory";
import { ProductionInventoryUpdate } from "./ProductionInventoryUpdate";
import { ProductionOrderProductPackage } from "./ProductionOrderProductPackage";

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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("char", { name: "code", unique: true, length: 12 })
  code: string;

  @Column("decimal", { name: "production_cost", precision: 10, scale: 2 })
  productionCost: string;

  @Column("mediumblob", { name: "photo" })
  photo: Buffer;

  @Column("int", { name: "pieces" })
  pieces: number;

  @Column("int", { name: "rop" })
  rop: number;

  @Column("decimal", { name: "weight", precision: 7, scale: 3 })
  weight: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

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

  @OneToMany(
    () => ProductPackageCostAnalysis,
    (productPackageCostAnalysis) => productPackageCostAnalysis.productPackage
  )
  productPackageCostAnalyses: ProductPackageCostAnalysis[];

  @OneToMany(
    () => ProductionInventory,
    (productionInventory) => productionInventory.productPackage
  )
  productionInventories: ProductionInventory[];

  @OneToMany(
    () => ProductionInventoryUpdate,
    (productionInventoryUpdate) => productionInventoryUpdate.productPackage
  )
  productionInventoryUpdates: ProductionInventoryUpdate[];

  @OneToMany(
    () => ProductionOrderProductPackage,
    (productionOrderProductPackage) =>
      productionOrderProductPackage.productPackage
  )
  productionOrderProductPackages: ProductionOrderProductPackage[];
}
