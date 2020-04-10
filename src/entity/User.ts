import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SessionLog } from "./SessionLog";
import { Employee } from "./Employee";
import { Role } from "./Role";
import { UserStatus } from "./UserStatus";

@Index("fk_user_userstatus1_idx", ["userStatusId"], {})
@Index("fk_user_employee1_idx", ["employeeCreatedId"], {})
@Index("fk_user_employee2_idx", ["employeeId"], {})
@Index("fk_user_role1_idx", ["roleId"], {})
@Entity("user", { schema: "twoelephantsfireworks" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("varchar", { name: "username", nullable: true, length: 45 })
  username: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 600 })
  password: string | null;

  @Column("date", { name: "docreation", nullable: true })
  docreation: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "user_status_id" })
  userStatusId: number;

  @Column("int", { name: "employee_created_id" })
  employeeCreatedId: number;

  @Column("int", { name: "role_id" })
  roleId: number;

  @OneToMany(() => SessionLog, (sessionLog) => sessionLog.user)
  sessionLogs: SessionLog[];

  @ManyToOne(() => Employee, (employee) => employee.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_created_id", referencedColumnName: "id" }])
  employeeCreated: Employee;

  @ManyToOne(() => Employee, (employee) => employee.users2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_status_id", referencedColumnName: "id" }])
  userStatus: UserStatus;
}
