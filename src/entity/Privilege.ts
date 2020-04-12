import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Module } from "./Module";
import { Role } from "./Role";

@Index("fk_privilege_role1_idx", ["roleId"], {})
@Index("fk_privilege_module1_idx", ["moduleId"], {})
@Entity("privilege", { schema: "twoelephantsfireworks" })
export class Privilege {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "permission", nullable: true, length: 4 })
  permission: string | null;

  @Column("int", { name: "role_id" })
  roleId: number;

  @Column("int", { name: "module_id" })
  moduleId: number;

  @ManyToOne(() => Module, (module) => module.privileges, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "module_id", referencedColumnName: "id" }])
  module: Module;

  @ManyToOne(() => Role, (role) => role.privileges, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
