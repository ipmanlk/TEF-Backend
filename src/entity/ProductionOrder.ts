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
import { ProductionOrderStatus } from "./ProductionOrderStatus";
import { ProductionOrderProductPackage } from "./ProductionOrderProductPackage";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("fk_production_order_employee1_idx", ["employeeId"], {})
@Index("fk_production_order_employee2_idx", ["confirmedEmployee"], {})
@Index(
  "fk_production_order_production_order_status1_idx",
  ["productionOrderStatusId"],
  {}
)
@Entity("production_order", { schema: "twoelephantsfireworks" })
export class ProductionOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", unique: true, length: 12 })
  code: string;

  @Column("date", { name: "required_date" })
  requiredDate: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "production_order_status_id" })
  productionOrderStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("date", { name: "confirmed_date", nullable: true })
  confirmedDate: string | null;

  @Column("int", { name: "confirmed_employee", nullable: true })
  confirmedEmployee: number | null;

  @ManyToOne(() => Employee, (employee) => employee.productionOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.productionOrders2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "confirmed_employee", referencedColumnName: "id" }])
  confirmedEmployee2: Employee;

  @ManyToOne(
    () => ProductionOrderStatus,
    (productionOrderStatus) => productionOrderStatus.productionOrders,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "production_order_status_id", referencedColumnName: "id" },
  ])
  productionOrderStatus: ProductionOrderStatus;

  @OneToMany(
    () => ProductionOrderProductPackage,
    (productionOrderProductPackage) =>
      productionOrderProductPackage.productionOrder
  )
  productionOrderProductPackages: ProductionOrderProductPackage[];
}
