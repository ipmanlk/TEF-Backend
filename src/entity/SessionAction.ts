import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SessionLog } from "./SessionLog";

@Entity("session_action", { schema: "twoelephantsfireworks" })
export class SessionAction {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => SessionLog, (sessionLog) => sessionLog.sessionAction)
  sessionLogs: SessionLog[];
}
