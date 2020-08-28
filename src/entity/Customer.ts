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
@Index("customer_mobile_UNIQUE", ["customerMobile"], { unique: true })
@Index("nic_UNIQUE", ["nic"], { unique: true })
@Index("email_UNIQUE", ["email"], { unique: true })
@Index("company_mobile_UNIQUE", ["companyMobile"], { unique: true })
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

  @Column("varchar", { name: "customer_name", length: 200 })
  customerName: string;

  @Column("char", { name: "customer_mobile", unique: true, length: 10 })
  customerMobile: string;

  @Column("char", { name: "nic", unique: true, length: 12 })
  nic: string;

  @Column("varchar", { name: "address", length: 200 })
  address: string;

  @Column("int", { name: "gender_id" })
  genderId: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("int", { name: "customer_status_id" })
  customerStatusId: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("varchar", { name: "company_name", nullable: true, length: 255 })
  companyName: string | null;

  @Column("char", {
    name: "company_mobile",
    nullable: true,
    unique: true,
    length: 10,
  })
  companyMobile: string | null;

  @Column("decimal", {
    name: "to_be_paid",
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  toBePaid: string;

  @Column("int", { name: "customer_type_id" })
  customerTypeId: number;

  @Column("int", { name: "points", nullable: true, default: () => "'0'" })
  points: number | null;

  @Column("int", { name: "employee_id" })
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
