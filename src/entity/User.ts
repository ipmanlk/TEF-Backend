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
import { SessionLog } from "./SessionLog";
import { Employee } from "./Employee";
import { UserStatus } from "./UserStatus";
import { UserRole } from "./UserRole";

@Index("employee_id_UNIQUE", ["employeeId"], { unique: true })
@Index("fk_user_employee1_idx", ["employeeCreatedId"], {})
@Index("fk_user_employee2_idx", ["employeeId"], {})
@Index("fk_user_userstatus1_idx", ["userStatusId"], {})
@Index("username_UNIQUE", ["username"], { unique: true })
@Entity("user", { schema: "twoelephantsfireworks" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "employee_id", unique: true })
  employeeId: number;

  @Column("varchar", {
    name: "username",
    nullable: true,
    unique: true,
    length: 45,
  })
  username: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 600 })
  password: string | null;

  @Column("date", { name: "added_date", nullable: true })
  addedDate: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "user_status_id" })
  userStatusId: number;

  @Column("int", { name: "employee_created_id" })
  employeeCreatedId: number;

  @OneToMany(() => SessionLog, (sessionLog) => sessionLog.user)
  sessionLogs: SessionLog[];

  @ManyToOne(() => Employee, (employee) => employee.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_created_id", referencedColumnName: "id" }])
  employeeCreated: Employee;

  @OneToOne(() => Employee, (employee) => employee.user, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_status_id", referencedColumnName: "id" }])
  userStatus: UserStatus;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
