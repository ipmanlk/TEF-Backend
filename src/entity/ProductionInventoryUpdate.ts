import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { ProductPackage } from "./ProductPackage";

@Index("fk_employee_production_inventory_employee1_idx", ["employeeId"], {})
@Index(
  "fk_employee_production_inventory_product_package1_idx",
  ["productPackageId"],
  {}
)
@Entity("production_inventory_update", { schema: "twoelephantsfireworks" })
export class ProductionInventoryUpdate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "qty" })
  qty: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("int", { name: "product_package_id" })
  productPackageId: number;

  @ManyToOne(
    () => Employee,
    (employee) => employee.productionInventoryUpdates,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.productionInventoryUpdates,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;
}
