import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ProductionOrder } from "./ProductionOrder";
import { ProductPackage } from "./ProductPackage";

@Index(
  "fk_production_order_has_product_package_product_package1_idx",
  ["productPackageId"],
  {}
)
@Index(
  "fk_production_order_has_product_package_production_order1_idx",
  ["productionOrderId"],
  {}
)
@Entity("production_order_product_package", { schema: "twoelephantsfireworks" })
export class ProductionOrderProductPackage {
  @Column("int", { primary: true, name: "production_order_id" })
  productionOrderId: number;

  @Column("int", { primary: true, name: "product_package_id" })
  productPackageId: number;

  @Column("int", { name: "qty" })
  qty: number;

  @ManyToOne(
    () => ProductionOrder,
    (productionOrder) => productionOrder.productionOrderProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "production_order_id", referencedColumnName: "id" }])
  productionOrder: ProductionOrder;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.productionOrderProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;
}
