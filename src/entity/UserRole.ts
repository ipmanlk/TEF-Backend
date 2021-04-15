import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { User } from "./User";

@Index("fk_role_has_user_user1_idx", ["userId"], {})
@Index("fk_role_has_user_role1_idx", ["roleId"], {})
@Entity("user_role", { schema: "twoelephantsfireworks" })
export class UserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "role_id" })
  roleId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;

  @ManyToOne(() => User, (user) => user.userRoles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
