import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "./Supplier";

@Entity("supplier_type", { schema: "twoelephantsfireworks" })
export class SupplierType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Supplier, (supplier) => supplier.supplierType)
  suppliers: Supplier[];
}
