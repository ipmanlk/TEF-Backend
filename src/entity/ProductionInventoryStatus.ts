import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductionInventory } from "./ProductionInventory";

@Entity("production_inventory_status", { schema: "twoelephantsfireworks" })
export class ProductionInventoryStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => ProductionInventory,
    (productionInventory) => productionInventory.productionInventoryStatus
  )
  productionInventories: ProductionInventory[];
}
