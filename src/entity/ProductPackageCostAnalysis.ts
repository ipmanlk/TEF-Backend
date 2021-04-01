import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { ProductPackage } from "./ProductPackage";
import { ProductPackageCostAnalysisMaterial } from "./ProductPackageCostAnalysisMaterial";

@Index("fk_production_package_cost_analysis_employee1_idx", ["employeeId"], {})
@Index(
  "fk_production_package_cost_analysis_product_package1_idx",
  ["productPackageId"],
  {}
)
@Entity("product_package_cost_analysis", { schema: "twoelephantsfireworks" })
export class ProductPackageCostAnalysis {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "product_package_id" })
  productPackageId: number;

  @Column("date", { name: "valid_from" })
  validFrom: string;

  @Column("date", { name: "valid_to" })
  validTo: string;

  @Column("decimal", { name: "material_cost", precision: 10, scale: 2 })
  materialCost: string;

  @Column("decimal", { name: "production_cost", precision: 10, scale: 2 })
  productionCost: string;

  @Column("decimal", { name: "total_cost", precision: 10, scale: 2 })
  totalCost: string;

  @Column("decimal", { name: "profit_ratio", precision: 5, scale: 2 })
  profitRatio: string;

  @Column("decimal", { name: "sale_price", precision: 10, scale: 2 })
  salePrice: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(
    () => Employee,
    (employee) => employee.productPackageCostAnalyses,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.productPackageCostAnalyses,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;

  @OneToMany(
    () => ProductPackageCostAnalysisMaterial,
    (productPackageCostAnalysisMaterial) =>
      productPackageCostAnalysisMaterial.productPackageCostAnalysis
  )
  productPackageCostAnalysisMaterials: ProductPackageCostAnalysisMaterial[];
}
