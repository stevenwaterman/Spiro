import { blank_object } from "svelte/internal";
import { writable, type Writable } from "svelte/store";

export type Rates = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 15 | 20 | 24 | 30 | 40 | 60 | 120 | -1 | -2 | -3 | -4 | -5 | -6 | -8 | -10 | -12 | -15 | -20 | -24 | -30 | -40 | -60 | -120;

export type ArmConfig = {
  nodeType: "ARM";
  length: number;
  color: string;
  rate: Rates;
  phase: number;

  nodes: Record<number, NodeConfig>;
}

export type PenConfig = {
  nodeType: "PEN";
  color: string;
}

export type NodeConfig = ArmConfig | PenConfig;

export const config: ArmConfig = {
  nodeType: "ARM",
  length: 5,
  color: "lightcoral",
  rate: 1,
  phase: 0,

  nodes: {
    2: {
      nodeType: "PEN",
      color: "black"
    },
    4: {
      nodeType: "ARM",
      length: 10,
      color: "lightblue",
      rate: 5,
      phase: 0.1,

      nodes: {
        7: {
          nodeType: "ARM",
          length: 6,
          color: "lightgreen",
          rate: -60,
          phase: 0.1,

          nodes: {
            4: {
              nodeType: "PEN",
              color: "blue"
            }
          }
        },
        3: {
          nodeType: "PEN",
          color: "green"
        }
      }
    }
  }
};

export type WheelConfig = {
  length: number; // nodes
  phase: number; // radians
  rate: Rates; // radians per second
}

export type PenWheelConfig = {
  wheels: WheelConfig[],
  color: string
};

export const duration = 30;
export const fraction = 1;
export const showStore: Writable<boolean> = writable(false);
