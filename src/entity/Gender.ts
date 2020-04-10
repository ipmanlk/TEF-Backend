import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity("gender", { schema: "twoelephantsfireworks" })
export class Gender {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Employee, (employee) => employee.gender)
  employees: Employee[];
}
