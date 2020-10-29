import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerInvoice } from "./CustomerInvoice";

@Entity("customer_payment_method", { schema: "twoelephantsfireworks" })
export class CustomerPaymentMethod {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => CustomerInvoice,
    (customerInvoice) => customerInvoice.customerPaymentMethod
  )
  customerInvoices: CustomerInvoice[];
}
