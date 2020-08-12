import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";

@Entity("customer_type", { schema: "twoelephantsfireworks" })
export class CustomerType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(() => Customer, (customer) => customer.customerType)
  customers: Customer[];
}
