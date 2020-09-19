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
import { Employee } from "./Employee";
import { QuotationRequest } from "./QuotationRequest";
import { QuotationStatus } from "./QuotationStatus";
import { QuotationMaterial } from "./QuotationMaterial";

@Index("fk_quotation_employee1_idx", ["employeeId"], {})
@Index("fk_quotation_quotation_request1_idx", ["quotationRequestId"], {})
@Index("fk_quotation_quotation_status1_idx", ["quotationStatusId"], {})
@Index("qnumber_UNIQUE", ["qnumber"], { unique: true })
@Index("quotation_request_id_UNIQUE", ["quotationRequestId"], { unique: true })
@Entity("quotation", { schema: "twoelephantsfireworks" })
export class Quotation {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "qnumber", unique: true, length: 12 })
  qnumber: string;

  @Column("date", { name: "valid_from" })
  validFrom: string;

  @Column("date", { name: "valid_to" })
  validTo: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("int", { name: "quotation_status_id" })
  quotationStatusId: number;

  @Column("int", { name: "quotation_request_id", unique: true })
  quotationRequestId: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.quotations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @OneToOne(
    () => QuotationRequest,
    (quotationRequest) => quotationRequest.quotation,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "quotation_request_id", referencedColumnName: "id" }])
  quotationRequest: QuotationRequest;

  @ManyToOne(
    () => QuotationStatus,
    (quotationStatus) => quotationStatus.quotations,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "quotation_status_id", referencedColumnName: "id" }])
  quotationStatus: QuotationStatus;

  @OneToMany(
    () => QuotationMaterial,
    (quotationMaterial) => quotationMaterial.quotation
  )
  quotationMaterials: QuotationMaterial[];
}
