import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Material } from "./Material";
import { MaterialInventoryStatus } from "./MaterialInventoryStatus";

@Index(
  "fk_material_inventory_material_inventory_status1_idx",
  ["materialInventoryStatusId"],
  {}
)
@Index("fk_material_inventory_material1_idx", ["materialId"], {})
@Entity("material_inventory", { schema: "twoelephantsfireworks" })
export class MaterialInventory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("decimal", { name: "qty", precision: 15, scale: 2 })
  qty: string;

  @Column("decimal", { name: "available_qty", precision: 7, scale: 2 })
  availableQty: string;

  @Column("int", { name: "material_inventory_status_id" })
  materialInventoryStatusId: number;

  @Column("int", { name: "material_id" })
  materialId: number;

  @ManyToOne(() => Material, (material) => material.materialInventories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_id", referencedColumnName: "id" }])
  material: Material;

  @ManyToOne(
    () => MaterialInventoryStatus,
    (materialInventoryStatus) => materialInventoryStatus.materialInventories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "material_inventory_status_id", referencedColumnName: "id" },
  ])
  materialInventoryStatus: MaterialInventoryStatus;
}
