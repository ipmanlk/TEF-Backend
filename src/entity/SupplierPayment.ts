import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Grn } from "./Grn";
import { SupplierPaymentMethod } from "./SupplierPaymentMethod";
import { SupplierPaymentStatus } from "./SupplierPaymentStatus";

@Index("pnumber_UNIQUE", ["pnumber"], { unique: true })
@Index("fk_supplier_payment_grn1_idx", ["grnId"], {})
@Index(
  "fk_supplier_payment_supplier_payment_status1_idx",
  ["supplierPaymentStatusId"],
  {}
)
@Index("fk_supplier_payment_employee1_idx", ["employeeId"], {})
@Index(
  "fk_supplier_payment_supplier_payment_method1_idx",
  ["supplierPaymentMethodId"],
  {}
)
@Entity("supplier_payment", { schema: "twoelephantsfireworks" })
export class SupplierPayment {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "pnumber", unique: true, length: 12 })
  pnumber: string;

  @Column("int", { name: "grn_id" })
  grnId: number;

  @Column("decimal", { name: "grn_net_total", precision: 10, scale: 2 })
  grnNetTotal: string;

  @Column("decimal", { name: "pay_amount", precision: 10, scale: 2 })
  payAmount: string;

  @Column("decimal", { name: "sup_total_amount", precision: 10, scale: 2 })
  supTotalAmount: string;

  @Column("decimal", { name: "balance", precision: 10, scale: 2 })
  balance: string;

  @Column("char", { name: "cheque_no", nullable: true, length: 10 })
  chequeNo: string | null;

  @Column("date", { name: "cheque_date", nullable: true })
  chequeDate: string | null;

  @Column("varchar", { name: "bankac_holder", nullable: true, length: 100 })
  bankacHolder: string | null;

  @Column("char", { name: "bankac_no", nullable: true, length: 15 })
  bankacNo: string | null;

  @Column("varchar", { name: "bankac_bank", nullable: true, length: 100 })
  bankacBank: string | null;

  @Column("varchar", { name: "bankac_branch", nullable: true, length: 100 })
  bankacBranch: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "supplier_payment_status_id" })
  supplierPaymentStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("int", { name: "supplier_payment_method_id" })
  supplierPaymentMethodId: number;

  @ManyToOne(() => Employee, (employee) => employee.supplierPayments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => Grn, (grn) => grn.supplierPayments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "grn_id", referencedColumnName: "id" }])
  grn: Grn;

  @ManyToOne(
    () => SupplierPaymentMethod,
    (supplierPaymentMethod) => supplierPaymentMethod.supplierPayments,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "supplier_payment_method_id", referencedColumnName: "id" },
  ])
  supplierPaymentMethod: SupplierPaymentMethod;

  @ManyToOne(
    () => SupplierPaymentStatus,
    (supplierPaymentStatus) => supplierPaymentStatus.supplierPayments,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "supplier_payment_status_id", referencedColumnName: "id" },
  ])
  supplierPaymentStatus: SupplierPaymentStatus;
}
