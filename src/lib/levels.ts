import { derived, writable, type Readable, type Writable } from "svelte/store";
import { answerStore, normaliseWheels } from "./solution";
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

  const normalisedAnswer: WheelConfig[][] = answer.map(conf => normaliseWheels(conf));

  return {
    answer: normalisedAnswer,
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

const levels: Record<number, Level> = {
  1: createLevel(
    [[{length: 4, rate: 2, phase: 0}, {length: 5, rate: 3, phase: 0}]],
    createArm(6, 0, "orange", 3),
    createArm(6, 1, "green", 3),
    createArm(6, -1, "red", 3),
    createArm(6, 2, "pink", 3),
    createArm(6, -2, "teal", 3),
    createArm(6, 3, "orange", 3),
    createArm(6, -3, "green", 3),
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

export const radiusStore: Readable<number> = derived(answerStore, answers => {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length * 20)
    .reduce((a,b) => a+b, 10));
  return Math.max(...radii);
});
