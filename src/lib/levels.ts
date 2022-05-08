import { derived, writable, type Readable, type Writable } from "svelte/store";
import { answersMatch, normaliseWheels } from "./solution";
import { anchorIdStore, nodeStoresWrapped, selectionStore } from "./state";
import type { ArmConfig, Color, NodeConfig, PenConfig, Rates } from "./types";
import { nodeConfigLookupStore, normalisedPenWheelConfigsStore } from "./Workspace/SpiroLine/state";
import type { WheelConfig } from "./Workspace/SpiroLine/types";

type Level = {
  name: string;
  answer: WheelConfig[][];
  pieces: Record<string, NodeConfig>;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function createLevel(name: string, answer: WheelConfig[][], ...nodes: NodeConfig[][]): Level {
  const pieces: Record<string, NodeConfig> = {};
  nodes.flat().forEach((node, idx) => {
    node.id = alphabet[idx];
    pieces[node.id] = node;
  });

  const normalisedAnswer: WheelConfig[][] = answer.map(conf => normaliseWheels(conf));

  return {
    name,
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

export function loadLevel(levelId: number) {
  levelCompleteStore.set(false);
  const level = levels[levelId];

  const output: Record<string, Writable<NodeConfig>> =
    Object.entries(level.pieces)
      .reduce((acc, [id, nodeConfig]) => {
        acc[id] = writable(nodeConfig);
        return acc;
      }, {} as Record<string, Writable<NodeConfig>>);

  levelStore.set(levelId);
  anchorIdStore.set(undefined);
  selectionStore.set(undefined);
  nodeStoresWrapped.set(output);
}

const levels: Record<number, Level> = {
  1: createLevel(
    "Starting Simple",
    [[{length: 1, rate: 1, phase: 0}]],
    createArm(2, 1, "red"),
    createPen("blue")
  ),

  2: createLevel(
    "Lengthy Lesson",
    [[{length: 3, rate: 1, phase: 0}]],
    createArm(6, 1, "red"),
    createPen("blue")
  ),
}

export const levelStore: Writable<number> = writable(1);

export const answerStore: Readable<WheelConfig[][]> = derived(levelStore, level => levels[level].answer);

export const answerCorrectStore: Readable<boolean> = derived(
  [answerStore, normalisedPenWheelConfigsStore],
  ([actual, user]) => answersMatch(actual, user));

export const levelCompleteStore: Writable<boolean> = writable(false);

nodeConfigLookupStore.subscribe(() => levelCompleteStore.set(false));

export const radiusStore: Readable<number> = derived(answerStore, answers => {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length * 20)
    .reduce((a,b) => a+b, 10));
  return Math.max(100, ...radii) * 2;
});