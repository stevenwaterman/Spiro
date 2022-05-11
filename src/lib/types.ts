export type Rates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 15 | 20 | 24 | 30 | 40 | 60 | 120 | -1 | -2 | -3 | -4 | -5 | -6 | -8 | -10 | -12 | -15 | -20 | -24 | -30 | -40 | -60 | -120;
export type Color = "red" | "orange" | "yellow" | "green" | "blue" | "purple";
export type Length = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type BasePlacement<TYPE extends string> = {
  type: TYPE;
}
type ParentPlacement = BasePlacement<"PARENT"> & {
  id: string;
  idx: number;
}
type SecondaryAnchorPlacement = BasePlacement<"SECONDARY"> & {
  left: number;
  top: number;
}
type PrimaryAnchorPlacement = BasePlacement<"PRIMARY">;

export type Placement = ParentPlacement | SecondaryAnchorPlacement | PrimaryAnchorPlacement;
type PlacementType = Placement["type"];
type LookupPlacement<TYPE extends PlacementType> = 
  TYPE extends "PARENT" ? ParentPlacement : 
  TYPE extends "SECONDARY" ? SecondaryAnchorPlacement : 
  PrimaryAnchorPlacement;

type BaseConfig<TYPE extends string, PTYPE extends PlacementType> = {
  id: string;
  type: TYPE;
  parent: LookupPlacement<PTYPE>;
}

export type ArmConfigPositioned<PTYPE extends PlacementType> = BaseConfig<"ARM", PTYPE> & {
  color: Color;
  length: Length;
  rate: Rates;
  phase: Phase;
};
export type ArmConfig = ArmConfigPositioned<any>;

export type PenConfigPositioned<PTYPE extends PlacementType> = BaseConfig<"PEN", PTYPE> & {
  color: Color;
};
export type PenConfig = PenConfigPositioned<any>;

export type NodeConfigPositioned<PTYPE extends PlacementType> = ArmConfigPositioned<PTYPE> | PenConfigPositioned<PTYPE>;
export type NodeConfig = NodeConfigPositioned<any>;

// Type Guards for .filter

export function isArm(node: NodeConfig | undefined): node is ArmConfig {
  return node?.type === "ARM";
}
export function isPen(node: NodeConfig | undefined): node is PenConfig {
  return node?.type === "PEN";
}

export function isParentPos(node: NodeConfig | undefined): node is NodeConfigPositioned<"PARENT"> {
  return node?.parent?.type === "PARENT";
}
export function isSecondaryPos(node: NodeConfig | undefined): node is NodeConfigPositioned<"SECONDARY"> {
  return node?.parent?.type === "SECONDARY";
}
export function isPrimaryPos(node: NodeConfig | undefined): node is NodeConfigPositioned<"PRIMARY"> {
  return node?.parent?.type === "PRIMARY";
}

export function isArmParent(node: NodeConfig | undefined): node is ArmConfigPositioned<"PARENT"> {
  return isArm(node) && isParentPos(node);
}
