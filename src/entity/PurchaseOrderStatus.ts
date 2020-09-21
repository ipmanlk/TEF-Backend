import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrder } from "./PurchaseOrder";

@Entity("purchase_order_status", { schema: "twoelephantsfireworks" })
export class PurchaseOrderStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.purchaseOrderStatus
  )
  purchaseOrders: PurchaseOrder[];
}
