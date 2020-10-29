import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { SessionAction } from "./SessionAction";

@Index("fk_session_log_session_action1_idx", ["sessionActionId"], {})
@Index("fk_sessionlog_user1_idx", ["userId"], {})
@Entity("session_log", { schema: "twoelephantsfireworks" })
export class SessionLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("varchar", { name: "action", nullable: true, length: 45 })
  action: string | null;

  @Column("datetime", {
    name: "datetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  datetime: Date | null;

  @Column("int", { name: "session_action_id" })
  sessionActionId: number;

  @ManyToOne(() => User, (user) => user.sessionLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(
    () => SessionAction,
    (sessionAction) => sessionAction.sessionLogs,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "session_action_id", referencedColumnName: "id" }])
  sessionAction: SessionAction;
}
