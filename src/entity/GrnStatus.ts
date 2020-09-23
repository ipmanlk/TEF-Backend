import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Grn } from "./Grn";

@Entity("grn_status", { schema: "twoelephantsfireworks" })
export class GrnStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(() => Grn, (grn) => grn.grnStatus)
  grns: Grn[];
}
