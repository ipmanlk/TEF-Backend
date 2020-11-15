import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { CustomerInvoice } from "./CustomerInvoice";
import { CustomerOrder } from "./CustomerOrder";
import { CivilStatus } from "./CivilStatus";
import { Designation } from "./Designation";
import { EmployeeStatus } from "./EmployeeStatus";
import { Gender } from "./Gender";
import { Grn } from "./Grn";
import { Material } from "./Material";
import { OperationLog } from "./OperationLog";
import { Product } from "./Product";
import { ProductionOrder } from "./ProductionOrder";
import { PurchaseOrder } from "./PurchaseOrder";
import { Quotation } from "./Quotation";
import { QuotationRequest } from "./QuotationRequest";
import { Supplier } from "./Supplier";
import { SupplierPayment } from "./SupplierPayment";
import { User } from "./User";

@Index("fk_employee_civilstatus1_idx", ["civilStatusId"], {})
@Index("fk_employee_designation1_idx", ["designationId"], {})
@Index("fk_employee_employeestatus1_idx", ["employeeStatusId"], {})
@Index("fk_employee_gender_idx", ["genderId"], {})
@Index("land_UNIQUE", ["land"], { unique: true })
@Index("mobile_UNIQUE", ["mobile"], { unique: true })
@Index("nic_UNIQUE", ["nic"], { unique: true })
@Index("number_UNIQUE", ["number"], { unique: true })
@Entity("employee", { schema: "twoelephantsfireworks" })
export class Employee {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "number", nullable: true, unique: true, length: 11 })
  number: string | null;

  @Column("varchar", { name: "full_name", length: 150 })
  fullName: string;

  @Column("varchar", { name: "calling_name", length: 45 })
  callingName: string;

  @Column("mediumblob", { name: "photo" })
  photo: Buffer;

  @Column("char", { name: "nic", unique: true, length: 12 })
  nic: string;

  @Column("date", { name: "birth_date" })
  birthDate: string;

  @Column("varchar", { name: "address", length: 200 })
  address: string;

  @Column("char", { name: "mobile", unique: true, length: 10 })
  mobile: string;

  @Column("char", { name: "land", nullable: true, unique: true, length: 10 })
  land: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "gender_id" })
  genderId: number;

  @Column("int", { name: "designation_id" })
  designationId: number;

  @Column("int", { name: "civil_status_id" })
  civilStatusId: number;

  @Column("int", { name: "employee_status_id" })
  employeeStatusId: number;

  @OneToMany(() => Customer, (customer) => customer.employee)
  customers: Customer[];

  @OneToMany(
    () => CustomerInvoice,
    (customerInvoice) => customerInvoice.employee
  )
  customerInvoices: CustomerInvoice[];

  @OneToMany(() => CustomerOrder, (customerOrder) => customerOrder.employee)
  customerOrders: CustomerOrder[];

  @ManyToOne(() => CivilStatus, (civilStatus) => civilStatus.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "civil_status_id", referencedColumnName: "id" }])
  civilStatus: CivilStatus;

  @ManyToOne(() => Designation, (designation) => designation.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "designation_id", referencedColumnName: "id" }])
  designation: Designation;

  @ManyToOne(
    () => EmployeeStatus,
    (employeeStatus) => employeeStatus.employees,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "employee_status_id", referencedColumnName: "id" }])
  employeeStatus: EmployeeStatus;

  @ManyToOne(() => Gender, (gender) => gender.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gender_id", referencedColumnName: "id" }])
  gender: Gender;

  @OneToMany(() => Grn, (grn) => grn.employee)
  grns: Grn[];

  @OneToMany(() => Material, (material) => material.employee)
  materials: Material[];

  @OneToMany(() => OperationLog, (operationLog) => operationLog.employee)
  operationLogs: OperationLog[];

  @OneToMany(() => Product, (product) => product.employee)
  products: Product[];

  @OneToMany(
    () => ProductionOrder,
    (productionOrder) => productionOrder.employee
  )
  productionOrders: ProductionOrder[];

  @OneToMany(
    () => ProductionOrder,
    (productionOrder) => productionOrder.confirmedEmployee2
  )
  productionOrders2: ProductionOrder[];

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.employee)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => Quotation, (quotation) => quotation.employee)
  quotations: Quotation[];

  @OneToMany(
    () => QuotationRequest,
    (quotationRequest) => quotationRequest.employee
  )
  quotationRequests: QuotationRequest[];

  @OneToMany(() => Supplier, (supplier) => supplier.employee)
  suppliers: Supplier[];

  @OneToMany(
    () => SupplierPayment,
    (supplierPayment) => supplierPayment.employee
  )
  supplierPayments: SupplierPayment[];

  @OneToMany(() => User, (user) => user.employeeCreated)
  users: User[];

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}
