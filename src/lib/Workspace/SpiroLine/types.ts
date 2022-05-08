import type { Rates } from "../../types";

export type WheelConfig = {
  length: number; // nodes
  phase: number; // radians
  rate: number; // radians per second (actual, dependent on ancestors)
}

export type PenWheelConfig = {
  wheels: WheelConfig[];
  color: string;
  penId: string;
};
