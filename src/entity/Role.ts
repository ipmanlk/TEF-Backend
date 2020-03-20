import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privilage } from "./Privilage";
import { User } from "./User";

@Entity("role", { schema: "twoelephantsfireworks" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(
    () => Privilage,
    privilage => privilage.role
  )
  privilages: Privilage[];

  @OneToMany(
    () => User,
    user => user.role
  )
  users: User[];
}
