import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerInvoice } from "./CustomerInvoice";

@Entity("customer_invoice_status", { schema: "twoelephantsfireworks" })
export class CustomerInvoiceStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => CustomerInvoice,
    (customerInvoice) => customerInvoice.customerInvoiceStatus
  )
  customerInvoices: CustomerInvoice[];
}
