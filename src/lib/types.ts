export type Rates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 15 | 20 | 24 | 30 | 40 | 60 | 120 | -1 | -2 | -3 | -4 | -5 | -6 | -8 | -10 | -12 | -15 | -20 | -24 | -30 | -40 | -60 | -120;
export type Color = "red" | "orange" | "yellow" | "green" | "blue" | "purple";
export type Length = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type BaseConfig<TYPE extends string> = {
  id: string;
  type: TYPE;
  parent: {
    id: string;
    idx: number;
  } | undefined;
}

export type ArmConfig = BaseConfig<"ARM"> & {
  color: Color;
  length: Length;
  rate: Rates;
  phase: Phase;
}

export type PenConfig = BaseConfig<"PEN"> & {
  color: Color;
};

export type NodeConfig = ArmConfig | PenConfig;
