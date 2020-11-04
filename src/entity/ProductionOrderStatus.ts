import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductionOrder } from "./ProductionOrder";

@Entity("production_order_status", { schema: "twoelephantsfireworks" })
export class ProductionOrderStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => ProductionOrder,
    (productionOrder) => productionOrder.productionOrderStatus
  )
  productionOrders: ProductionOrder[];
}
