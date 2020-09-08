import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuotationRequest } from "./QuotationRequest";

@Entity("quotation_request_status", { schema: "twoelephantsfireworks" })
export class QuotationRequestStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => QuotationRequest,
    (quotationRequest) => quotationRequest.quotationRequestStatus
  )
  quotationRequests: QuotationRequest[];
}
