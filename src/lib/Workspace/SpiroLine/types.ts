export type WheelConfig = {
  length: number; // nodes
  phase: number; // 1/12 of a turn (30deg), absolute
  rate: number; // turns per run, absolute
}

export type PenWheelConfig = {
  wheels: WheelConfig[];
  color: string;
  penId: string;
  anchorId: string;
};
