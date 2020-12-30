import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CustomerOrder } from "./CustomerOrder";
import { ProductPackage } from "./ProductPackage";

@Index(
  "fk_customer_order_has_product_package_customer_order1_idx",
  ["customerOrderId"],
  {}
)
@Index(
  "fk_customer_order_has_product_package_product_package1_idx",
  ["productPackageId"],
  {}
)
@Entity("customer_order_product_package", { schema: "twoelephantsfireworks" })
export class CustomerOrderProductPackage {
  @Column("int", { primary: true, name: "customer_order_id" })
  customerOrderId: number;

  @Column("int", { primary: true, name: "product_package_id" })
  productPackageId: number;

  @Column("decimal", { name: "sale_price", precision: 9, scale: 2 })
  salePrice: string;

  @Column("int", { name: "qty" })
  qty: number;

  @Column("decimal", { name: "line_total", precision: 10, scale: 2 })
  lineTotal: string;

  @ManyToOne(
    () => CustomerOrder,
    (customerOrder) => customerOrder.customerOrderProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "customer_order_id", referencedColumnName: "id" }])
  customerOrder: CustomerOrder;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.customerOrderProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;
}
