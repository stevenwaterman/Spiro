import type { Rates } from "../../types";

export type WheelConfig = {
  length: number; // nodes
  phase: number; // radians
  rate: Rates; // radians per second
}

export type PenWheelConfig = {
  wheels: WheelConfig[];
  color: string;
  penId: string;
};
