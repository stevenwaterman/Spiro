export type Rates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 15 | 20 | 24 | 30 | 40 | 60 | 120 | -1 | -2 | -3 | -4 | -5 | -6 | -8 | -10 | -12 | -15 | -20 | -24 | -30 | -40 | -60 | -120;
export type Color = "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export type Placement = {
  phase: number;
  path: number[];
  children: Record<number, string>;
  parent: string | undefined;
};

type BaseConfig = {
  id: string;
  placement?: Placement;
}

export type ArmConfig = BaseConfig & {
  nodeType: "ARM";
  properties: {
    length: number;
    color: Color;
    rate: Rates;
  };
}

export type PenConfig = BaseConfig & {
  nodeType: "PEN";
  properties: {
    color: Color;
  };
};

export type NodeConfig = ArmConfig | PenConfig;
