import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "./Supplier";

@Entity("supplier_status", { schema: "twoelephantsfireworks" })
export class SupplierStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(() => Supplier, (supplier) => supplier.supplierStatus)
  suppliers: Supplier[];
}
