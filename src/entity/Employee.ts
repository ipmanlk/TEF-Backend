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
import { CivilStatus } from "./CivilStatus";
import { Designation } from "./Designation";
import { EmployeeStatus } from "./EmployeeStatus";
import { Gender } from "./Gender";
import { OperationLog } from "./OperationLog";
import { User } from "./User";

@Index("number_UNIQUE", ["number"], { unique: true })
@Index("fk_employee_gender_idx", ["genderId"], {})
@Index("fk_employee_designation1_idx", ["designationId"], {})
@Index("fk_employee_civilstatus1_idx", ["civilStatusId"], {})
@Index("fk_employee_employeestatus1_idx", ["employeeStatusId"], {})
@Entity("employee", { schema: "twoelephantsfireworks" })
export class Employee {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "number", nullable: true, unique: true, length: 4 })
  number: string | null;

  @Column("varchar", { name: "full_name", nullable: true, length: 150 })
  fullName: string | null;

  @Column("varchar", { name: "calling_name", nullable: true, length: 45 })
  callingName: string | null;

  @Column("mediumblob", { name: "photo", nullable: true })
  photo: Buffer | null;

  @Column("char", { name: "nic", nullable: true, length: 12 })
  nic: string | null;

  @Column("date", { name: "dobirth", nullable: true })
  dobirth: string | null;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("char", { name: "mobile", nullable: true, length: 10 })
  mobile: string | null;

  @Column("char", { name: "land", nullable: true, length: 10 })
  land: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("date", { name: "doassignment", nullable: true })
  doassignment: string | null;

  @Column("int", { name: "gender_id" })
  genderId: number;

  @Column("int", { name: "designation_id" })
  designationId: number;

  @Column("int", { name: "civil_status_id" })
  civilStatusId: number;

  @Column("int", { name: "employee_status_id" })
  employeeStatusId: number;

  @ManyToOne(() => CivilStatus, (civilStatus) => civilStatus.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "civil_status_id", referencedColumnName: "id" }])
  civilStatus: CivilStatus;

  @ManyToOne(() => Designation, (designation) => designation.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "designation_id", referencedColumnName: "id" }])
  designation: Designation;

  @ManyToOne(
    () => EmployeeStatus,
    (employeeStatus) => employeeStatus.employees,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "employee_status_id", referencedColumnName: "id" }])
  employeeStatus: EmployeeStatus;

  @ManyToOne(() => Gender, (gender) => gender.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gender_id", referencedColumnName: "id" }])
  gender: Gender;

  @OneToMany(() => OperationLog, (operationLog) => operationLog.employee)
  operationLogs: OperationLog[];

  @OneToMany(() => User, (user) => user.employeeCreated)
  users: User[];

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}
