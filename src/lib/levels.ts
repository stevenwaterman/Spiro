import { derived, writable, type Readable, type Writable } from "svelte/store";
import { nodeStoresWrapped } from "./state";
import type { ArmConfig, Color, NodeConfig, PenConfig, Rates } from "./types";
import type { WheelConfig } from "./Workspace/SpiroLine/types";

type Level = {
  answer: WheelConfig[][];
  pieces: Record<string, NodeConfig>;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function createLevel(answer: WheelConfig[][], ...nodes: NodeConfig[][]): Level {
  const pieces: Record<string, NodeConfig> = {};
  nodes.flat().forEach((node, idx) => {
    node.id = alphabet[idx];
    pieces[node.id] = node;
  });

  return {
    answer,
    pieces
  };
}

function createArm(length: number, rate: Rates, color: Color, count?: number): ArmConfig[] {
  const output: ArmConfig[] = [];
  for (let i = 0; i < (count ?? 1); i++) {
    output.push({
      id: "TODO",
      nodeType: "ARM",
      properties: {
        length, rate, color
      }
    });
  }
  return output;
}

function createPen(color: Color): PenConfig[] {
  return [{
    id: "TODO",
    nodeType: "PEN",
    properties: { color }
  }];
}

function fromStringToWheelConfig(config: string): WheelConfig[] {
  const wheels = config.split(" ").filter(s => s.length > 0).map(arm => {
    const [lengthStr, rateAndPhaseStr] = arm.split("x");
    const length = Number.parseFloat(lengthStr);

    const [rateStr, phaseStr] = rateAndPhaseStr.split("+");
    const rate = Number.parseFloat(rateStr);
    const phase = Number.parseFloat(phaseStr) * 2 * Math.PI;

    return { length, rate, phase };
  });
  const normalised = normaliseConfig(wheels);
  // console.log(config);
  console.log(fromWheelConfigToString(normalised));
  return normalised;
}

function fromWheelConfigToString(config: WheelConfig[]): string {
  return config
    .map(wheel => `${wheel.length}x${wheel.rate}+${wheel.phase / (2 * Math.PI)}`)
    .join(" ");
}

const levels: Record<number, Level> = {
  1: createLevel(
    [
      // fromStringToWheelConfig("3x2+0 5x3+0 2x-1+0 4x2+0"),
      // fromStringToWheelConfig("2x1+0 7x-2+0 5x-3+0")
      fromStringToWheelConfig("3x1+0 3x3+0.125")
    ],
    createArm(5, 0, "orange", 3),
    createArm(5, 1, "green", 3),
    createArm(5, -1, "red", 3),
    createArm(5, 2, "pink", 3),
    createArm(5, -2, "teal", 3),
    createArm(5, 3, "orange", 3),
    createArm(5, -3, "green", 3),
    createPen("teal")
  )
}

export function loadLevel(levelId: number) {
  const level = levels[levelId];

  const output: Record<string, Writable<NodeConfig>> =
    Object.entries(level.pieces)
      .reduce((acc, [id, nodeConfig]) => {
        acc[id] = writable(nodeConfig);
        return acc;
      }, {} as Record<string, Writable<NodeConfig>>);

  nodeStoresWrapped.set(output);
  answerStore.set(level.answer)
}

export const answerStore: Writable<WheelConfig[][]> = writable([]);
export const radiusStore: Readable<number> = derived(answerStore, answers => {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length * 20)
    .reduce((a,b) => a+b, 10));
  return Math.max(...radii);
});

function normaliseConfig(wheels: WheelConfig[]): WheelConfig[] {
  const sorted = [...wheels];
  sorted.sort((a,b) => a.rate - b.rate);

  const combinedRates: WheelConfig[] = sorted.reduce(
    (acc: WheelConfig[][], elem: WheelConfig) => {
      if (acc.length === 0) return [[elem]];

      const currentList = acc[acc.length - 1];
      if (currentList[0].rate !== elem.rate) {
        acc.push([elem]);
        return acc;
      } else {
        currentList.push(elem);
        return acc;
      }
  }, []).map(configs => combineMultipleSameRate(configs));

  const rateList = combinedRates.map(config => Math.abs(config.rate)).filter(rate => rate !== 0);
  const slowest = Math.min(...rateList);
  const normalisedRates = combinedRates.map(config => ({...config, rate: config.rate / slowest}));

  const normalisedPhase = normalisedRates.map(config => ({...config, phase: config.phase % 1}));
  const normalString = fromWheelConfigToString(normalisedPhase);

  const invertRate = normalisedPhase.map(config => ({...config, rate: -config.rate}));
  invertRate.sort((a,b) => a.rate - b.rate);
  const invertString = fromWheelConfigToString(invertRate);

  return invertString > normalString ? invertRate : normalisedPhase;
}

function combineMultipleSameRate(configs: WheelConfig[]): WheelConfig {
  let config: WheelConfig = configs[0];
  for (let i = 1; i < configs.length; i++) {
    config = combineSameRate(config, configs[i]);
  }
  return config;
}

function combineSameRate(a: WheelConfig, b: WheelConfig): WheelConfig {
  const rate = a.rate;

  const aAngle = a.phase * 2 * Math.PI;
  const aDeltaX = Math.cos(aAngle) * a.length;
  const aDeltaY = Math.sin(aAngle) * a.length;

  const bAngle = b.phase * 2 * Math.PI;
  const bDeltaX = Math.cos(bAngle) * b.length;
  const bDeltaY = Math.sin(bAngle) * b.length;

  const deltaX = aDeltaX + bDeltaX;
  const deltaY = aDeltaY + bDeltaY;
  const length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  const angle = Math.acos(deltaX / length);
  const phase = angle / (2 * Math.PI);
  return { length, phase, rate };
}
