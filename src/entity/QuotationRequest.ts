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
import { Quotation } from "./Quotation";
import { Employee } from "./Employee";
import { QuotationRequestMaterial } from "./QuotationRequestMaterial";
import { QuotationRequestStatus } from "./QuotationRequestStatus";
import { Supplier } from "./Supplier";

@Index("qrnumber_UNIQUE", ["qrnumber"], { unique: true })
@Index("fk_quotation_request_employee1_idx", ["employeeId"], {})
@Index("fk_quotation_request_supplier1_idx", ["supplierId"], {})
@Index(
  "fk_quotation_request_quotation_request_status1_idx",
  ["quotationRequestStatusId"],
  {}
)
@Entity("quotation_request", { schema: "twoelephantsfireworks" })
export class QuotationRequest {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "qrnumber", unique: true, length: 12 })
  qrnumber: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("date", { name: "due_date" })
  dueDate: string;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("int", { name: "supplier_id" })
  supplierId: number;

  @Column("int", { name: "quotation_request_status_id" })
  quotationRequestStatusId: number;

  @OneToOne(() => Quotation, (quotation) => quotation.quotationRequest)
  quotation: Quotation;

  @ManyToOne(() => Employee, (employee) => employee.quotationRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @OneToMany(
    () => QuotationRequestMaterial,
    (quotationRequestMaterial) => quotationRequestMaterial.quotationRequest
  )
  quotationRequestMaterials: QuotationRequestMaterial[];

  @ManyToOne(
    () => QuotationRequestStatus,
    (quotationRequestStatus) => quotationRequestStatus.quotationRequests,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "quotation_request_status_id", referencedColumnName: "id" },
  ])
  quotationRequestStatus: QuotationRequestStatus;

  @ManyToOne(() => Supplier, (supplier) => supplier.quotationRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "supplier_id", referencedColumnName: "id" }])
  supplier: Supplier;
}
