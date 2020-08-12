import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItemPackageStatus } from "./ItemPackageStatus";
import { ItemPackageType } from "./ItemPackageType";
import { Product } from "./Product";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("fk_item_package_product1_idx", ["productId"], {})
@Index("fk_item_package_item_package_type1_idx", ["itemPackageTypeId"], {})
@Index("fk_item_package_item_package_status1_idx", ["itemPackageStatusId"], {})
@Entity("item_package", { schema: "twoelephantsfireworks" })
export class ItemPackage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("int", { name: "item_package_type_id" })
  itemPackageTypeId: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("char", { name: "code", unique: true, length: 11 })
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

  @Column("date", { name: "dointroduction", nullable: true })
  dointroduction: string | null;

  @Column("int", { name: "item_package_status_id" })
  itemPackageStatusId: number;

  @ManyToOne(
    () => ItemPackageStatus,
    (itemPackageStatus) => itemPackageStatus.itemPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "item_package_status_id", referencedColumnName: "id" }])
  itemPackageStatus: ItemPackageStatus;

  @ManyToOne(
    () => ItemPackageType,
    (itemPackageType) => itemPackageType.itemPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "item_package_type_id", referencedColumnName: "id" }])
  itemPackageType: ItemPackageType;

  @ManyToOne(() => Product, (product) => product.itemPackages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;
}
