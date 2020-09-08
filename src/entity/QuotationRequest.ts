import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quotation } from "./Quotation";
import { Employee } from "./Employee";
import { QuotationRequestStatus } from "./QuotationRequestStatus";
import { Supplier } from "./Supplier";
import { QuotationRequestMaterial } from "./QuotationRequestMaterial";

@Index("qrnumber_UNIQUE", ["qrnumber"], { unique: true })
@Index("fk_quotation_request_employee1_idx", ["employeeId"], {})
@Index("fk_quotation_request_qr_status1_idx", ["qrStatusId"], {})
@Index("fk_quotation_request_supplier1_idx", ["supplierId"], {})
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

  @Column("int", { name: "qr_status_id" })
  qrStatusId: number;

  @Column("int", { name: "supplier_id" })
  supplierId: number;

  @OneToMany(() => Quotation, (quotation) => quotation.quotationRequest)
  quotations: Quotation[];

  @ManyToOne(() => Employee, (employee) => employee.quotationRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => QuotationRequestStatus,
    (quotationRequestStatus) => quotationRequestStatus.quotationRequests,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "qr_status_id", referencedColumnName: "id" }])
  qrStatus: QuotationRequestStatus;

  @ManyToOne(() => Supplier, (supplier) => supplier.quotationRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "supplier_id", referencedColumnName: "id" }])
  supplier: Supplier;

  @OneToMany(
    () => QuotationRequestMaterial,
    (quotationRequestMaterial) => quotationRequestMaterial.quotationRequest
  )
  quotationRequestMaterials: QuotationRequestMaterial[];
}
