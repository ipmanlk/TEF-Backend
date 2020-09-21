import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { MaterialStatus } from "./MaterialStatus";
import { MaterialType } from "./MaterialType";
import { RiskCategory } from "./RiskCategory";
import { UnitType } from "./UnitType";
import { MaterialAnalysis } from "./MaterialAnalysis";
import { MaterialInventory } from "./MaterialInventory";
import { PurchaseOrderMaterial } from "./PurchaseOrderMaterial";
import { QuotationMaterial } from "./QuotationMaterial";
import { QuotationRequestMaterial } from "./QuotationRequestMaterial";
import { Supplier } from "./Supplier";

@Index("fk_material_employee1_idx", ["employeeId"], {})
@Index("fk_material_material_status1_idx", ["materialStatusId"], {})
@Index("fk_material_material_type1_idx", ["materialTypeId"], {})
@Index("fk_material_risk_category1_idx", ["riskCategoryId"], {})
@Index("fk_material_unit_type1_idx", ["unitTypeId"], {})
@Entity("material", { schema: "twoelephantsfireworks" })
export class Material {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("char", { name: "code", length: 12 })
  code: string;

  @Column("decimal", {
    name: "unit_price",
    nullable: true,
    precision: 7,
    scale: 2,
  })
  unitPrice: string | null;

  @Column("int", { name: "rop", nullable: true })
  rop: number | null;

  @Column("int", { name: "roq", nullable: true })
  roq: number | null;

  @Column("int", { name: "material_type_id" })
  materialTypeId: number;

  @Column("int", { name: "unit_type_id" })
  unitTypeId: number;

  @Column("int", { name: "material_status_id" })
  materialStatusId: number;

  @Column("int", { name: "risk_category_id" })
  riskCategoryId: number;

  @Column("date", { name: "added_date" })
  addedDate: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "employee_id" })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.materials, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

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

  @OneToMany(
    () => MaterialAnalysis,
    (materialAnalysis) => materialAnalysis.material
  )
  materialAnalyses: MaterialAnalysis[];

  @OneToMany(
    () => MaterialInventory,
    (materialInventory) => materialInventory.material
  )
  materialInventories: MaterialInventory[];

  @OneToMany(
    () => PurchaseOrderMaterial,
    (purchaseOrderMaterial) => purchaseOrderMaterial.material
  )
  purchaseOrderMaterials: PurchaseOrderMaterial[];

  @OneToMany(
    () => QuotationMaterial,
    (quotationMaterial) => quotationMaterial.material
  )
  quotationMaterials: QuotationMaterial[];

  @OneToMany(
    () => QuotationRequestMaterial,
    (quotationRequestMaterial) => quotationRequestMaterial.material
  )
  quotationRequestMaterials: QuotationRequestMaterial[];

  @ManyToMany(() => Supplier, (supplier) => supplier.materials)
  @JoinTable({
    name: "supplier_material",
    joinColumns: [{ name: "material_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "supplier_id", referencedColumnName: "id" }],
    schema: "twoelephantsfireworks",
  })
  suppliers: Supplier[];
}
