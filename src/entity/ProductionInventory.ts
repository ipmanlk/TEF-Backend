import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductionInventoryStatus } from "./ProductionInventoryStatus";
import { ProductPackage } from "./ProductPackage";

@Index("fk_production_inventory_product_package1_idx", ["productPackageId"], {})
@Index(
  "fk_production_inventory_production_inventory_status1_idx",
  ["productionInventoryStatusId"],
  {}
)
@Entity("production_inventory", { schema: "twoelephantsfireworks" })
export class ProductionInventory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "product_package_id" })
  productPackageId: number;

  @Column("int", { name: "qty" })
  qty: number;

  @Column("int", { name: "available_qty" })
  availableQty: number;

  @Column("int", { name: "production_inventory_status_id" })
  productionInventoryStatusId: number;

  @ManyToOne(
    () => ProductionInventoryStatus,
    (productionInventoryStatus) =>
      productionInventoryStatus.productionInventories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "production_inventory_status_id", referencedColumnName: "id" },
  ])
  productionInventoryStatus: ProductionInventoryStatus;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.productionInventories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;
}
