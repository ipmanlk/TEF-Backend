import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerStatus } from "./CustomerStatus";
import { Employee } from "./Employee";
import { Gender } from "./Gender";

@Index("fk_customer_gender1_idx", ["genderId"], {})
@Index("fk_customer_customer_status1_idx", ["customerStatusId"], {})
@Index("fk_customer_employee1_idx", ["employeeId"], {})
@Entity("customer", { schema: "twoelephantsfireworks" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 200 })
  name: string;

  @Column("varchar", { name: "address", length: 200 })
  address: string;

  @Column("char", { name: "nic", length: 12 })
  nic: string;

  @Column("int", { name: "gender_id" })
  genderId: number;

  @Column("char", { name: "mobile", length: 10 })
  mobile: string;

  @Column("char", { name: "land", length: 10 })
  land: string;

  @Column("varchar", { name: "email", length: 100 })
  email: string;

  @Column("int", { name: "customer_status_id" })
  customerStatusId: number;

  @Column("text", { name: "description" })
  description: string;

  @Column("date", {
    name: "doregistration",
    default: () => "CURRENT_TIMESTAMP",
  })
  doregistration: string;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(
    () => CustomerStatus,
    (customerStatus) => customerStatus.customers,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "customer_status_id", referencedColumnName: "id" }])
  customerStatus: CustomerStatus;

  @ManyToOne(() => Employee, (employee) => employee.customers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => Gender, (gender) => gender.customers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gender_id", referencedColumnName: "id" }])
  gender: Gender;
}
