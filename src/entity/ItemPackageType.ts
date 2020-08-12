import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemPackage } from "./ItemPackage";

@Entity("item_package_type", { schema: "twoelephantsfireworks" })
export class ItemPackageType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => ItemPackage, (itemPackage) => itemPackage.itemPackageType)
  itemPackages: ItemPackage[];
}
