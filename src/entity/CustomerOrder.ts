import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerInvoice } from "./CustomerInvoice";
import { Customer } from "./Customer";
import { CustomerOrderStatus } from "./CustomerOrderStatus";
import { Employee } from "./Employee";
import { CustomerOrderProductPackage } from "./CustomerOrderProductPackage";

@Index("cusno_UNIQUE", ["cocode"], { unique: true })
@Index("fk_customer_order_customer1_idx", ["customerId"], {})
@Index(
  "fk_customer_order_customer_order_status1_idx",
  ["customerOrderStatusId"],
  {}
)
@Index("fk_customer_order_employee1_idx", ["employeeId"], {})
@Entity("customer_order", { schema: "twoelephantsfireworks" })
export class CustomerOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "cocode", unique: true, length: 12 })
  cocode: string;

  @Column("int", { name: "customer_id" })
  customerId: number;

  @Column("decimal", { name: "grand_total", precision: 10, scale: 2 })
  grandTotal: string;

  @Column("decimal", {
    name: "discount_ratio",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  discountRatio: string;

  @Column("decimal", { name: "net_total", precision: 10, scale: 2 })
  netTotal: string;

  @Column("date", { name: "required_date" })
  requiredDate: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "customer_order_status_id" })
  customerOrderStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @OneToOne(
    () => CustomerInvoice,
    (customerInvoice) => customerInvoice.customerOrder
  )
  customerInvoice: CustomerInvoice;

  @ManyToOne(() => Customer, (customer) => customer.customerOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customer;

  @ManyToOne(
    () => CustomerOrderStatus,
    (customerOrderStatus) => customerOrderStatus.customerOrders,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "customer_order_status_id", referencedColumnName: "id" },
  ])
  customerOrderStatus: CustomerOrderStatus;

  @ManyToOne(() => Employee, (employee) => employee.customerOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @OneToMany(
    () => CustomerOrderProductPackage,
    (customerOrderProductPackage) => customerOrderProductPackage.customerOrder
  )
  customerOrderProductPackages: CustomerOrderProductPackage[];
}
