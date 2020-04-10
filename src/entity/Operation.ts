import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OperationLog } from "./OperationLog";

@Entity("operation", { schema: "twoelephantsfireworks" })
export class Operation {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => OperationLog, (operationLog) => operationLog.operation)
  operationLogs: OperationLog[];
}
