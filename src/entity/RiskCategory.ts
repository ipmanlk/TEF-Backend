import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./Material";
import { Product } from "./Product";

@Entity("risk_category", { schema: "twoelephantsfireworks" })
export class RiskCategory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Material, (material) => material.riskCategory)
  materials: Material[];

  @OneToMany(() => Product, (product) => product.riskCategory)
  products: Product[];
}
