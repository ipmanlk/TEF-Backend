import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MaterialInventory } from "./MaterialInventory";

@Entity("material_inventory_status", { schema: "twoelephantsfireworks" })
export class MaterialInventoryStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => MaterialInventory,
    (materialInventory) => materialInventory.materialInventoryStatus
  )
  materialInventories: MaterialInventory[];
}
