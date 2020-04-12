import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OperationLog } from "./OperationLog";
import { Privilege } from "./Privilege";

@Index("name_UNIQUE", ["name"], { unique: true })
@Entity("module", { schema: "twoelephantsfireworks" })
export class Module {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, unique: true, length: 45 })
  name: string | null;

  @OneToMany(() => OperationLog, (operationLog) => operationLog.module)
  operationLogs: OperationLog[];

  @OneToMany(() => Privilege, (privilege) => privilege.module)
  privileges: Privilege[];
}
