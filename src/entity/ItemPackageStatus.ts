import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemPackage } from "./ItemPackage";

@Entity("item_package_status", { schema: "twoelephantsfireworks" })
export class ItemPackageStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => ItemPackage, (itemPackage) => itemPackage.itemPackageStatus)
  itemPackages: ItemPackage[];
}
