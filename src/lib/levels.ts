import { derived, writable, type Readable, type Writable } from "svelte/store";
import { answersMatch, fromWheelConfigToString, normaliseWheels } from "./solution";
import { anchorIdStore, durationStore, nodesConfigStore, selectionStore } from "./state";
import type { ArmConfig, Color, NodeConfig, PenConfig, Rates } from "./types";
import { normalisedPenWheelConfigsStore } from "./Workspace/SpiroLine/state";
import type { WheelConfig } from "./Workspace/SpiroLine/types";

type Level = {
  name: string;
  duration: number;
  answer: WheelConfig[][];
  pieces: Record<string, NodeConfig>;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function createLevel(name: string, duration: number, answer: WheelConfig[][], ...nodes: NodeConfig[][]): Level {
  const pieces: Record<string, NodeConfig> = {};
  nodes.flat().forEach((node, idx) => {
    node.id = alphabet[idx];
    pieces[node.id] = node;
  });

  const normalisedAnswer: WheelConfig[][] = answer.map(conf => normaliseWheels(conf));

  return {
    name,
    duration,
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

  const output: Record<string, NodeConfig> =
    Object.entries(level.pieces)
      .reduce((acc, [id, nodeConfig]) => {
        acc[id] = nodeConfig;
        return acc;
      }, {} as Record<string, NodeConfig>);

  levelStore.set(levelId);
  anchorIdStore.set(undefined);
  selectionStore.set(undefined);
  durationStore.set(level.duration);
  nodesConfigStore.set(JSON.parse(JSON.stringify(output)));
}

const levels: Record<number, Level> = {
  1: createLevel(
    "Starting Simple",
    1,
    [[{length: 1, rate: 1, phase: 0}]],
    createArm(2, 1, "red"),
    createPen("green")
  ),

  2: createLevel(
    "Lengthy Lesson",
    1,
    [[{length: 3, rate: 1, phase: 0}]],
    createArm(6, 1, "red"),
    createPen("green")
  ),

  3: createLevel(
    "Teamwork",
    3,
    [[{length: 4, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(5, 1, "blue"),
    createPen("green")
  ),

  4: createLevel(
    "All Together",
    3,
    [[{length: 3, rate: 1, phase: 0}, {length: 1, rate: 2, phase: 0}, {length: 3, rate: 3, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(4, 1, "blue"),
    createArm(3, 1, "orange"),
    createPen("green")
  ),

  5: createLevel(
    "Speedy Session",
    3,
    [[{length: 5, rate: 1, phase: 0}, {length: 2, rate: 5, phase: 0}]],
    createArm(6, 1, "red"),
    createArm(3, 4, "blue"),
    createPen("green")
  ),

  6: createLevel(
    "Spin Crazy",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 13, phase: 0}]],
    createArm(6, 1, "red"),
    createArm(4, 12, "blue"),
    createPen("green")
  ),

  7: createLevel(
    "Getting Rapid",
    10,
    [[{length: 9, rate: 1, phase: 0}, {length: 5, rate: 7, phase: 1}, {length: 1, rate: 31, phase: 0}]],
    createArm(10, 1, "red"),
    createArm(6, 6, "blue"),
    createArm(3, 24, "orange"),
    createPen("green")
  ),

  10: createLevel(
    "Going Both Ways",
    5,
    [[{length: 2, rate: 1, phase: 0}, {length: 3, rate: 0, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(4, -1, "blue"),
    createPen("green")
  ),

  12: createLevel(
    "R-R-R-Rotate",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0.25}]],
    createArm(4, 1, "red"),
    createArm(4, 1, "blue"),
    createPen("green")
  )
}

export const levelStore: Writable<number> = writable(1);
export const levelNameStore: Readable<string> = derived(levelStore, level => levels[level].name);

export const answerStore: Readable<WheelConfig[][]> = derived(levelStore, level => levels[level].answer);
answerStore.subscribe(s => s.forEach(w => console.log("Answer", fromWheelConfigToString(w))))

export const answerCorrectStore: Readable<boolean> = derived(
  [answerStore, normalisedPenWheelConfigsStore],
  ([actual, user]) => answersMatch(actual, user));

export const levelCompleteStore: Writable<boolean> = writable(false);

nodesConfigStore.subscribe(() => levelCompleteStore.set(false));

export const radiusStore: Readable<number> = derived(answerStore, answers => {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length * 20)
    .reduce((a,b) => a+b, 10));
  return Math.max(100, ...radii);
});