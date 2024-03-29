import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privilege } from "./Privilege";
import { UserRole } from "./UserRole";

@Entity("role", { schema: "twoelephantsfireworks" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Privilege, (privilege) => privilege.role)
  privileges: Privilege[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
