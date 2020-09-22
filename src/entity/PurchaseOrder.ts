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
import { PurchaseOrderStatus } from "./PurchaseOrderStatus";
import { Quotation } from "./Quotation";
import { PurchaseOrderMaterial } from "./PurchaseOrderMaterial";

@Index("pocode_UNIQUE", ["pocode"], { unique: true })
@Index("quotation_id_UNIQUE", ["quotationId"], { unique: true })
@Index("fk_purchase_order_quotation1_idx", ["quotationId"], {})
@Index(
  "fk_purchase_order_purchase_order_status1_idx",
  ["purchaseOrderStatusId"],
  {}
)
@Index("fk_purchase_order_employee1_idx", ["employeeId"], {})
@Entity("purchase_order", { schema: "twoelephantsfireworks" })
export class PurchaseOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "pocode", unique: true, length: 12 })
  pocode: string;

  @Column("int", { name: "quotation_id", unique: true })
  quotationId: number;

  @Column("date", { name: "required_date" })
  requiredDate: string;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("decimal", { name: "total_price", precision: 7, scale: 2 })
  totalPrice: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "purchase_order_status_id" })
  purchaseOrderStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.purchaseOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => PurchaseOrderStatus,
    (purchaseOrderStatus) => purchaseOrderStatus.purchaseOrders,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "purchase_order_status_id", referencedColumnName: "id" },
  ])
  purchaseOrderStatus: PurchaseOrderStatus;

  @OneToOne(() => Quotation, (quotation) => quotation.purchaseOrder, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "quotation_id", referencedColumnName: "id" }])
  quotation: Quotation;

  @OneToMany(
    () => PurchaseOrderMaterial,
    (purchaseOrderMaterial) => purchaseOrderMaterial.purchaseOrder
  )
  purchaseOrderMaterials: PurchaseOrderMaterial[];
}
