import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItemPackage } from "./ItemPackage";
import { Category } from "./Category";
import { ProductStatus } from "./ProductStatus";
import { ProductType } from "./ProductType";
import { RiskCategory } from "./RiskCategory";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("fk_product_risk_category1_idx", ["riskCategoryId"], {})
@Index("fk_product_product_status1_idx", ["productStatusId"], {})
@Index("fk_product_category1_idx", ["categoryId"], {})
@Index("fk_product_product_type1_idx", ["productTypeId"], {})
@Entity("product", { schema: "twoelephantsfireworks" })
export class Product {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", unique: true, length: 11 })
  code: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("decimal", { name: "price", nullable: true, precision: 5, scale: 2 })
  price: string | null;

  @Column("decimal", { name: "cost", nullable: true, precision: 5, scale: 2 })
  cost: string | null;

  @Column("mediumblob", { name: "photo", nullable: true })
  photo: Buffer | null;

  @Column("decimal", {
    name: "weight_firing",
    nullable: true,
    precision: 7,
    scale: 3,
  })
  weightFiring: string | null;

  @Column("decimal", {
    name: "weight_actual",
    nullable: true,
    precision: 7,
    scale: 3,
  })
  weightActual: string | null;

  @Column("int", { name: "expire_duration", nullable: true })
  expireDuration: number | null;

  @Column("int", { name: "qty", nullable: true })
  qty: number | null;

  @Column("date", { name: "docreation", nullable: true })
  docreation: string | null;

  @Column("int", { name: "risk_category_id" })
  riskCategoryId: number;

  @Column("int", { name: "product_status_id" })
  productStatusId: number;

  @Column("int", { name: "category_id" })
  categoryId: number;

  @Column("int", { name: "product_type_id" })
  productTypeId: number;

  @OneToMany(() => ItemPackage, (itemPackage) => itemPackage.product)
  itemPackages: ItemPackage[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: Category;

  @ManyToOne(() => ProductStatus, (productStatus) => productStatus.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_status_id", referencedColumnName: "id" }])
  productStatus: ProductStatus;

  @ManyToOne(() => ProductType, (productType) => productType.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_type_id", referencedColumnName: "id" }])
  productType: ProductType;

  @ManyToOne(() => RiskCategory, (riskCategory) => riskCategory.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "risk_category_id", referencedColumnName: "id" }])
  riskCategory: RiskCategory;
}
