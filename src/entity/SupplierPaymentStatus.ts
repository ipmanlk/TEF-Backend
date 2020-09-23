import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SupplierPayment } from "./SupplierPayment";

@Entity("supplier_payment_status", { schema: "twoelephantsfireworks" })
export class SupplierPaymentStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => SupplierPayment,
    (supplierPayment) => supplierPayment.supplierPaymentStatus
  )
  supplierPayments: SupplierPayment[];
}
