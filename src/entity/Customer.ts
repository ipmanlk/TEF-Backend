import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerStatus } from "./CustomerStatus";
import { CustomerType } from "./CustomerType";
import { Employee } from "./Employee";
import { Gender } from "./Gender";

@Index("reg_no_UNIQUE", ["number"], { unique: true })
@Index("fk_customer_gender1_idx", ["genderId"], {})
@Index("fk_customer_customer_status1_idx", ["customerStatusId"], {})
@Index("fk_customer_customer_type1_idx", ["customerTypeId"], {})
@Index("fk_customer_employee1_idx", ["employeeId"], {})
@Entity("customer", { schema: "twoelephantsfireworks" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "number", unique: true, length: 12 })
  number: string;

  @Column("varchar", { name: "cname", length: 200 })
  cname: string;

  @Column("char", { name: "cmobile", length: 10 })
  cmobile: string;

  @Column("char", { name: "nic", length: 12 })
  nic: string;

  @Column("varchar", { name: "address", length: 200 })
  address: string;

  @Column("int", { name: "gender_id" })
  genderId: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("int", { name: "customer_status_id" })
  customerStatusId: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "doregistration" })
  doregistration: string;

  @Column("varchar", { name: "cpname", nullable: true, length: 255 })
  cpname: string | null;

  @Column("char", { name: "cpmobile", nullable: true, length: 10 })
  cpmobile: string | null;

  @Column("decimal", { name: "to_be_paid", precision: 8, scale: 2 })
  toBePaid: string;

  @Column("int", { name: "customer_type_id" })
  customerTypeId: number;

  @Column("int", { name: "points", nullable: true })
  points: number | null;

  @Column("int", { primary: true, name: "employee_id" })
  employeeId: number;

  @ManyToOne(
    () => CustomerStatus,
    (customerStatus) => customerStatus.customers,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "customer_status_id", referencedColumnName: "id" }])
  customerStatus: CustomerStatus;

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customer_type_id", referencedColumnName: "id" }])
  customerType: CustomerType;

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
