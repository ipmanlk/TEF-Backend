import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OperationLog } from "./OperationLog";
import { Privilage } from "./Privilage";

@Index("name_UNIQUE", ["name"], { unique: true })
@Entity("module", { schema: "twoelephantsfireworks" })
export class Module {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, unique: true, length: 45 })
  name: string | null;

  @OneToMany(() => OperationLog, (operationLog) => operationLog.module)
  operationLogs: OperationLog[];

  @OneToMany(() => Privilage, (privilage) => privilage.module)
  privilages: Privilage[];
}
