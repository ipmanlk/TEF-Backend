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
import { Customer } from "./Customer";
import { CustomerInvoiceCustomerType } from "./CustomerInvoiceCustomerType";
import { CustomerInvoiceStatus } from "./CustomerInvoiceStatus";
import { CustomerOrder } from "./CustomerOrder";
import { CustomerPaymentMethod } from "./CustomerPaymentMethod";
import { Employee } from "./Employee";
import { CustomerInvoiceProductPackage } from "./CustomerInvoiceProductPackage";

@Index("code_UNIQUE", ["code"], { unique: true })
@Index("customer_order_id_UNIQUE", ["customerOrderId"], { unique: true })
@Index("cheque_no_UNIQUE", ["chequeNo"], { unique: true })
@Index(
  "fk_customer_invoice_customer_invoice_status1_idx",
  ["customerInvoiceStatusId"],
  {}
)
@Index("fk_customer_invoice_employee1_idx", ["employeeId"], {})
@Index("fk_customer_invoice_customer_order1_idx", ["customerOrderId"], {})
@Index(
  "fk_customer_invoice_customer_payment_method1_idx",
  ["customerPaymentMethodId"],
  {}
)
@Index("fk_customer_invoice_customer1_idx", ["customerId"], {})
@Index(
  "fk_customer_invoice_customer_invoice_customer_type1_idx",
  ["customerInvoiceCustomerTypeId"],
  {}
)
@Entity("customer_invoice", { schema: "twoelephantsfireworks" })
export class CustomerInvoice {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", unique: true, length: 12 })
  code: string;

  @Column("decimal", { name: "grand_total", precision: 10, scale: 2 })
  grandTotal: string;

  @Column("decimal", { name: "discount_ratio", precision: 5, scale: 2 })
  discountRatio: string;

  @Column("decimal", { name: "net_total", precision: 10, scale: 2 })
  netTotal: string;

  @Column("decimal", { name: "cus_total_amount", precision: 10, scale: 2 })
  cusTotalAmount: string;

  @Column("decimal", { name: "payed_amount", precision: 10, scale: 2 })
  payedAmount: string;

  @Column("decimal", {
    name: "balance",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  balance: string | null;

  @Column("char", {
    name: "cheque_no",
    nullable: true,
    unique: true,
    length: 10,
  })
  chequeNo: string | null;

  @Column("date", { name: "cheque_date", nullable: true })
  chequeDate: string | null;

  @Column("varchar", { name: "bankac_bank", nullable: true, length: 100 })
  bankacBank: string | null;

  @Column("varchar", { name: "bankac_refnumber", nullable: true, length: 100 })
  bankacRefnumber: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "customer_invoice_status_id" })
  customerInvoiceStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("int", { name: "customer_order_id", nullable: true, unique: true })
  customerOrderId: number | null;

  @Column("int", { name: "customer_payment_method_id" })
  customerPaymentMethodId: number;

  @Column("int", { name: "customer_id", nullable: true })
  customerId: number | null;

  @Column("int", { name: "customer_invoice_customer_type_id" })
  customerInvoiceCustomerTypeId: number;

  @ManyToOne(() => Customer, (customer) => customer.customerInvoices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customer;

  @ManyToOne(
    () => CustomerInvoiceCustomerType,
    (customerInvoiceCustomerType) =>
      customerInvoiceCustomerType.customerInvoices,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "customer_invoice_customer_type_id", referencedColumnName: "id" },
  ])
  customerInvoiceCustomerType: CustomerInvoiceCustomerType;

  @ManyToOne(
    () => CustomerInvoiceStatus,
    (customerInvoiceStatus) => customerInvoiceStatus.customerInvoices,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "customer_invoice_status_id", referencedColumnName: "id" },
  ])
  customerInvoiceStatus: CustomerInvoiceStatus;

  @OneToOne(
    () => CustomerOrder,
    (customerOrder) => customerOrder.customerInvoice,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "customer_order_id", referencedColumnName: "id" }])
  customerOrder: CustomerOrder;

  @ManyToOne(
    () => CustomerPaymentMethod,
    (customerPaymentMethod) => customerPaymentMethod.customerInvoices,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "customer_payment_method_id", referencedColumnName: "id" },
  ])
  customerPaymentMethod: CustomerPaymentMethod;

  @ManyToOne(() => Employee, (employee) => employee.customerInvoices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @OneToMany(
    () => CustomerInvoiceProductPackage,
    (customerInvoiceProductPackage) =>
      customerInvoiceProductPackage.customerInvoice
  )
  customerInvoiceProductPackages: CustomerInvoiceProductPackage[];
}
