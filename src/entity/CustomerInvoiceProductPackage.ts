import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CustomerInvoice } from "./CustomerInvoice";
import { ProductPackage } from "./ProductPackage";

@Index(
  "fk_customer_invoice_has_product_package_product_package1_idx",
  ["productPackageId"],
  {}
)
@Index(
  "fk_customer_invoice_has_product_package_customer_invoice1_idx",
  ["customerInvoiceId"],
  {}
)
@Entity("customer_invoice_product_package", { schema: "twoelephantsfireworks" })
export class CustomerInvoiceProductPackage {
  @Column("int", { primary: true, name: "customer_invoice_id" })
  customerInvoiceId: number;

  @Column("int", { primary: true, name: "product_package_id" })
  productPackageId: number;

  @Column("int", { name: "requested_qty" })
  requestedQty: number;

  @Column("int", { name: "delivered_qty" })
  deliveredQty: number;

  @Column("decimal", { name: "sale_price", precision: 8, scale: 2 })
  salePrice: string;

  @Column("decimal", { name: "line_total", precision: 10, scale: 2 })
  lineTotal: string;

  @ManyToOne(
    () => CustomerInvoice,
    (customerInvoice) => customerInvoice.customerInvoiceProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "customer_invoice_id", referencedColumnName: "id" }])
  customerInvoice: CustomerInvoice;

  @ManyToOne(
    () => ProductPackage,
    (productPackage) => productPackage.customerInvoiceProductPackages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "product_package_id", referencedColumnName: "id" }])
  productPackage: ProductPackage;
}
