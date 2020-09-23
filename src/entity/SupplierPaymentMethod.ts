import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SupplierPayment } from "./SupplierPayment";

@Entity("supplier_payment_method", { schema: "twoelephantsfireworks" })
export class SupplierPaymentMethod {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(
    () => SupplierPayment,
    (supplierPayment) => supplierPayment.supplierPaymentMethod
  )
  supplierPayments: SupplierPayment[];
}
