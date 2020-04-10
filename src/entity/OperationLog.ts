import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Operation } from "./Operation";
import { Employee } from "./Employee";
import { Module } from "./Module";

@Index("fk_operationlog_employee1_idx", ["employeeId"], {})
@Index("fk_operationlog_module1_idx", ["moduleId"], {})
@Index("fk_operation_log_operation1_idx", ["operationId"], {})
@Entity("operation_log", { schema: "twoelephantsfireworks" })
export class OperationLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @Column("int", { name: "module_id" })
  moduleId: number;

  @Column("datetime", {
    name: "datetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  datetime: Date | null;

  @Column("int", { name: "operation_id" })
  operationId: number;

  @ManyToOne(() => Operation, (operation) => operation.operationLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "operation_id", referencedColumnName: "id" }])
  operation: Operation;

  @ManyToOne(() => Employee, (employee) => employee.operationLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(() => Module, (module) => module.operationLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "module_id", referencedColumnName: "id" }])
  module: Module;
}
