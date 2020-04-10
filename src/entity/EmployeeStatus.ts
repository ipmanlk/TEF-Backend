import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity("employee_status", { schema: "twoelephantsfireworks" })
export class EmployeeStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Employee, (employee) => employee.employeeStatus)
  employees: Employee[];
}
