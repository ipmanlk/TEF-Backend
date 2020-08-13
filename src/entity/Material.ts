import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MaterialStatus } from "./MaterialStatus";
import { MaterialType } from "./MaterialType";
import { RiskCategory } from "./RiskCategory";
import { UnitType } from "./UnitType";

@Index("fk_material_material_type1_idx", ["materialTypeId"], {})
@Index("fk_material_unit_type1_idx", ["unitTypeId"], {})
@Index("fk_material_material_status1_idx", ["materialStatusId"], {})
@Index("fk_material_risk_category1_idx", ["riskCategoryId"], {})
@Entity("material", { schema: "twoelephantsfireworks" })
export class Material {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("char", { name: "code", length: 11 })
  code: string;

  @Column("decimal", {
    name: "unit_price",
    nullable: true,
    precision: 7,
    scale: 2,
  })
  unitPrice: string | null;

  @Column("int", { name: "expire_duration" })
  expireDuration: number;

  @Column("int", { name: "rop", nullable: true })
  rop: number | null;

  @Column("int", { name: "roq", nullable: true })
  roq: number | null;

  @Column("int", { name: "qty", nullable: true })
  qty: number | null;

  @Column("int", { name: "material_type_id" })
  materialTypeId: number;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @Column("int", { name: "material_status_id" })
  materialStatusId: number;

  @Column("int", { name: "risk_category_id" })
  riskCategoryId: number;

  @ManyToOne(
    () => MaterialStatus,
    (materialStatus) => materialStatus.materials,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "material_status_id", referencedColumnName: "id" }])
  materialStatus: MaterialStatus;

  @ManyToOne(() => MaterialType, (materialType) => materialType.materials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "material_type_id", referencedColumnName: "id" }])
  materialType: MaterialType;

  @ManyToOne(() => RiskCategory, (riskCategory) => riskCategory.materials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "risk_category_id", referencedColumnName: "id" }])
  riskCategory: RiskCategory;

  @ManyToOne(() => UnitType, (unitType) => unitType.materials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "unit_type_id", referencedColumnName: "id" }])
  unitType: UnitType;
}