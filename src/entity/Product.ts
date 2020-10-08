import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MaterialAnalysis } from "./MaterialAnalysis";
import { ProductCategory } from "./ProductCategory";
import { Employee } from "./Employee";
import { ProductStatus } from "./ProductStatus";
import { RiskCategory } from "./RiskCategory";
import { UnitType } from "./UnitType";
import { ProductPackage } from "./ProductPackage";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("fk_product_category1_idx", ["categoryId"], {})
@Index("fk_product_employee1_idx", ["employeeId"], {})
@Index("fk_product_product_status1_idx", ["productStatusId"], {})
@Index("fk_product_risk_category1_idx", ["riskCategoryId"], {})
@Index("fk_product_unit_type1_idx", ["unitTypeId"], {})
@Entity("product", { schema: "twoelephantsfireworks" })
export class Product {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", unique: true, length: 12 })
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

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @Column("int", { name: "expire_duration", nullable: true })
  expireDuration: number | null;

  @Column("int", {
    name: "available_qty",
    nullable: true,
    default: () => "'0'",
  })
  availableQty: number | null;

  @Column("date", { name: "added_date", nullable: true })
  addedDate: string | null;

  @Column("int", { name: "risk_category_id" })
  riskCategoryId: number;

  @Column("int", { name: "product_status_id" })
  productStatusId: number;

  @Column("int", { name: "category_id" })
  categoryId: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @OneToMany(
    () => MaterialAnalysis,
    (materialAnalysis) => materialAnalysis.product
  )
  materialAnalyses: MaterialAnalysis[];

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: ProductCategory;

  @ManyToOne(() => Employee, (employee) => employee.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => ProductStatus, (productStatus) => productStatus.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_status_id", referencedColumnName: "id" }])
  productStatus: ProductStatus;

  @ManyToOne(() => RiskCategory, (riskCategory) => riskCategory.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "risk_category_id", referencedColumnName: "id" }])
  riskCategory: RiskCategory;

  @ManyToOne(() => UnitType, (unitType) => unitType.products, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;

  @OneToMany(() => ProductPackage, (productPackage) => productPackage.product)
  productPackages: ProductPackage[];
}
