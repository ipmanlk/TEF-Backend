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
import { Grn } from "./Grn";
import { Employee } from "./Employee";
import { PurchaseOrderMaterial } from "./PurchaseOrderMaterial";
import { PurchaseOrderStatus } from "./PurchaseOrderStatus";
import { Quotation } from "./Quotation";

@Index("fk_purchase_order_employee1_idx", ["employeeId"], {})
@Index(
  "fk_purchase_order_purchase_order_status1_idx",
  ["purchaseOrderStatusId"],
  {}
)
@Index("fk_purchase_order_quotation1_idx", ["quotationId"], {})
@Index("pocode_UNIQUE", ["pocode"], { unique: true })
@Entity("purchase_order", { schema: "twoelephantsfireworks" })
export class PurchaseOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "pocode", unique: true, length: 12 })
  pocode: string;

  @Column("int", { name: "quotation_id" })
  quotationId: number;

  @Column("date", { name: "required_date" })
  requiredDate: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("decimal", { name: "total_price", precision: 10, scale: 2 })
  totalPrice: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "purchase_order_status_id" })
  purchaseOrderStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @OneToOne(() => Grn, (grn) => grn.purchaseOrder)
  grn: Grn;

  @ManyToOne(() => Employee, (employee) => employee.purchaseOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @OneToMany(
    () => PurchaseOrderMaterial,
    (purchaseOrderMaterial) => purchaseOrderMaterial.purchaseOrder
  )
  purchaseOrderMaterials: PurchaseOrderMaterial[];

  @ManyToOne(
    () => PurchaseOrderStatus,
    (purchaseOrderStatus) => purchaseOrderStatus.purchaseOrders,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "purchase_order_status_id", referencedColumnName: "id" },
  ])
  purchaseOrderStatus: PurchaseOrderStatus;

  @ManyToOne(() => Quotation, (quotation) => quotation.purchaseOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "quotation_id", referencedColumnName: "id" }])
  quotation: Quotation;
}
