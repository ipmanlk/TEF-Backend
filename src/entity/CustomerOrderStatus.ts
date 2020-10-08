import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerOrder } from "./CustomerOrder";

@Entity("customer_order_status", { schema: "twoelephantsfireworks" })
export class CustomerOrderStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => CustomerOrder,
    (customerOrder) => customerOrder.customerOrderStatus
  )
  customerOrders: CustomerOrder[];
}
