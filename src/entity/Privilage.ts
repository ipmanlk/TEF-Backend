import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Module } from "./Module";
import { Role } from "./Role";

@Index("fk_privilage_role1_idx", ["roleId"], {})
@Index("fk_privilage_module1_idx", ["moduleId"], {})
@Entity("privilage", { schema: "twoelephantsfireworks" })
export class Privilage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "permission", nullable: true, length: 4 })
  permission: string | null;

  @Column("int", { name: "role_id" })
  roleId: number;

  @Column("int", { name: "module_id" })
  moduleId: number;

  @ManyToOne(
    () => Module,
    module => module.privilages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "module_id", referencedColumnName: "id" }])
  module: Module;

  @ManyToOne(
    () => Role,
    role => role.privilages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
