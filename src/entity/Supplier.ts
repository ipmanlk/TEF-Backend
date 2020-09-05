import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuotationRequest } from "./QuotationRequest";
import { Employee } from "./Employee";
import { SupplierStatus } from "./SupplierStatus";
import { Material } from "./Material";

@Index("person_mobile_UNIQUE", ["personMobile"], { unique: true })
@Index("nic_UNIQUE", ["nic"], { unique: true })
@Index("reg_number_UNIQUE", ["regNumber"], { unique: true })
@Index("code_UNIQUE", ["code"], { unique: true })
@Index("company_mobile_UNIQUE", ["companyMobile"], { unique: true })
@Index("fk_supplier_supplier_status1_idx", ["supplierStatusId"], {})
@Index("fk_supplier_employee1_idx", ["employeeId"], {})
@Entity("supplier", { schema: "twoelephantsfireworks" })
export class Supplier {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", nullable: true, unique: true, length: 11 })
  code: string | null;

  @Column("varchar", { name: "person_name", length: 200 })
  personName: string;

  @Column("char", { name: "person_mobile", unique: true, length: 10 })
  personMobile: string;

  @Column("char", { name: "nic", unique: true, length: 12 })
  nic: string;

  @Column("varchar", { name: "company_name", nullable: true, length: 255 })
  companyName: string | null;

  @Column("char", {
    name: "company_mobile",
    nullable: true,
    unique: true,
    length: 10,
  })
  companyMobile: string | null;

  @Column("varchar", { name: "reg_number", unique: true, length: 12 })
  regNumber: string;

  @Column("varchar", { name: "email", length: 150 })
  email: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("decimal", {
    name: "arrears",
    precision: 7,
    scale: 2,
    default: () => "'0.00'",
  })
  arrears: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "supplier_status_id" })
  supplierStatusId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @OneToMany(
    () => QuotationRequest,
    (quotationRequest) => quotationRequest.supplier
  )
  quotationRequests: QuotationRequest[];

  @ManyToOne(() => Employee, (employee) => employee.suppliers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => SupplierStatus,
    (supplierStatus) => supplierStatus.suppliers,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "supplier_status_id", referencedColumnName: "id" }])
  supplierStatus: SupplierStatus;

  @ManyToMany(() => Material, (material) => material.suppliers)
  materials: Material[];
}