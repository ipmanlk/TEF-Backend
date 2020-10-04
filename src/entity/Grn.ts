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
import { Employee } from "./Employee";
import { GrnStatus } from "./GrnStatus";
import { PurchaseOrder } from "./PurchaseOrder";
import { GrnMaterial } from "./GrnMaterial";
import { SupplierPayment } from "./SupplierPayment";

@Index("grncode_UNIQUE", ["grncode"], { unique: true })
@Index("purchase_order_id_UNIQUE", ["purchaseOrderId"], { unique: true })
@Index("fk_grn_grn_status1_idx", ["grnStatusId"], {})
@Index("fk_grn_purchase_order1_idx", ["purchaseOrderId"], {})
@Index("fk_grn_employee1_idx", ["employeeId"], {})
@Entity("grn", { schema: "twoelephantsfireworks" })
export class Grn {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "grncode", unique: true, length: 12 })
  grncode: string;

  @Column("char", { name: "invoice_no", length: 12 })
  invoiceNo: string;

  @Column("decimal", { name: "grand_total", precision: 10, scale: 2 })
  grandTotal: string;

  @Column("decimal", { name: "discount_ratio", precision: 5, scale: 2 })
  discountRatio: string;

  @Column("decimal", { name: "net_total", precision: 10, scale: 2 })
  netTotal: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "received_date" })
  receivedDate: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "grn_status_id" })
  grnStatusId: number;

  @Column("int", { name: "purchase_order_id", unique: true })
  purchaseOrderId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.grns, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => GrnStatus, (grnStatus) => grnStatus.grns, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "grn_status_id", referencedColumnName: "id" }])
  grnStatus: GrnStatus;

  @OneToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.grn, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "purchase_order_id", referencedColumnName: "id" }])
  purchaseOrder: PurchaseOrder;

  @OneToMany(() => GrnMaterial, (grnMaterial) => grnMaterial.grn)
  grnMaterials: GrnMaterial[];

  @OneToOne(() => SupplierPayment, (supplierPayment) => supplierPayment.grn)
  supplierPayment: SupplierPayment;
}
