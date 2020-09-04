import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quotation } from "./Quotation";

@Entity("quotation_status", { schema: "twoelephantsfireworks" })
export class QuotationStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Quotation, (quotation) => quotation.quotationStatus)
  quotations: Quotation[];
}
