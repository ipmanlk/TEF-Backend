import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./Material";

@Entity("material_type", { schema: "twoelephantsfireworks" })
export class MaterialType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Material, (material) => material.materialType)
  materials: Material[];
}
