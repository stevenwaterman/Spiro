export type ArmConfig = {
  nodeType: "ARM";
  length: number;
  color: string;
  rate: number;
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
          rate: -10,
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
  rate: number; // radians per second
}

export type PenWheelConfig = {
  wheels: WheelConfig[],
  color: string
};
