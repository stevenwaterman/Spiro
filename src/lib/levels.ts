import { derived, writable, type Readable, type Writable } from "svelte/store";
import { answersMatch, fromStringToWheelConfig, fromWheelConfigToString, normaliseWheels } from "./solution";
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

  return {
    name,
    duration,
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
  // Starting
  1: createLevel(
    "Starting Simple",
    1,
    [[{length: 1, rate: 1, phase: 0}]],
    createArm(2, 1, "red"),
    createPen("green")
  ),

  // Length Exists, You don't have to place pens at the end
  2: createLevel(
    "Lengthy Lesson",
    1,
    [[{length: 3, rate: 1, phase: 0}]],
    createArm(6, 1, "red"),
    createPen("green")
  ),

  // You can join multiple arms together
  3: createLevel(
    "Teamwork",
    3,
    [[{length: 4, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(5, 1, "blue"),
    createPen("green")
  ),

  // Combining everything so far
  4: createLevel(
    "All Together",
    3,
    [[{length: 3, rate: 1, phase: 0}, {length: 1, rate: 2, phase: 0}, {length: 3, rate: 3, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(4, 1, "blue"),
    createArm(3, 1, "orange"),
    createPen("green")
  ),

  // Different Speeds Exist
  5: createLevel(
    "Speedy Session",
    3,
    [[{length: 5, rate: 1, phase: 0}, {length: 2, rate: 5, phase: 0}]],
    createArm(6, 1, "red"),
    createArm(3, 4, "blue"),
    createPen("green")
  ),

  6: createLevel(
    "Spin Slightly",
    3,
    [[{length: 3, rate: 1, phase: 0}, {length: 4, rate: 4, phase: 0}]],
    createArm(5, 1, "red"),
    createArm(5, 3, "orange"),
    createPen("green")
  ),

  7: createLevel(
    "Spin Crazy",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 13, phase: 0}]],
    createArm(6, 1, "red"),
    createArm(4, 12, "blue"),
    createPen("green")
  ),

  8: createLevel(
    "Getting Rapid",
    10,
    [[{length: 9, rate: 1, phase: 0}, {length: 5, rate: 7, phase: 0}, {length: 1, rate: 31, phase: 0}]],
    createArm(10, 1, "red"),
    createArm(6, 6, "blue"),
    createArm(3, 24, "orange"),
    createPen("green")
  ),

  9: createLevel(
    "Flux Capacitor",
    5,
    [[{length: 5, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}, {length: 2, rate: 3, phase: 0}, {length: 1, rate: 6, phase: 0}]],
    createArm(6, 1, "red"),
    createArm(4, 1, "orange"),
    createArm(4, 1, "blue"),
    createArm(4, 3, "purple"),
    createPen("green")
  ),

  // Introducing negative speeds
  10: createLevel(
    "Going Both Ways",
    3,
    [[{length: 2, rate: 1, phase: 0}, {length: 3, rate: 0, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(4, -1, "blue"),
    createPen("green")
  ),

  11: createLevel(
    "Squishy",
    3,
    [[{length: 4, rate: 1, phase: 0}, {length: 2, rate: -1, phase: 0}]],
    createArm(5, -1, "red"),
    createArm(4, 2, "blue"),
    createPen("green")
  ),

  12: createLevel(
    "'Peach'",
    5,
    [[{length: 4, rate: 1, phase: 0}, {length: 2, rate: 2, phase: 0}, {length: 3, rate: 0, phase: 0}]],
    createArm(5, 1, "red"),
    createArm(3, 1, "orange"),
    createArm(4, -2, "blue"),
    createPen("green")
  ),

  13: createLevel(
    "Windmill",
    5,
    [[{length: 5, rate: 1, phase: 0}, {length: 5, rate: -2, phase: 0}]],
    createArm(6, -1, "red"),
    createArm(6, 3, "orange"),
    createPen("green")
  ),

  14: createLevel(
    "Fishy",
    5,
    [[{length: 5, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}, {length: 5, rate: -1, phase: 0}]],
    createArm(6, -1, "red"),
    createArm(4, -1, "orange"),
    createArm(6, 3, "blue"),
    createPen("green")
  ),

  // Introducing Phase
  15: createLevel(
    "Scroll Stroll",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 3}]],
    createArm(4, 1, "red"),
    createArm(4, 1, "blue"),
    createPen("green")
  ),

  16: createLevel(
    "Spectacle",
    5,
    [[{length: 3, rate: 1, phase: 3}, {length: 3, rate: 2, phase: 3}, {length: 4, rate: 4, phase: 3}]],
    createArm(4, 1, "red"),
    createArm(4, 1, "blue"),
    createArm(5, 2, "orange"),
    createPen("green")
  ),

  17: createLevel(
    "Dice",
    5,
    [[{length: 3, rate: 1, phase: 2}, {length: 2, rate: 5, phase: 10}, {length: 1, rate: -3, phase: 0}]],
    createArm(4, 1, "red"),
    createArm(3, 4, "blue"),
    createArm(2, -8, "orange"),
    createPen("green")
  ),

  18: createLevel(
    "Subscribe",
    5,
    [[{length: 4, rate: 1, phase: 0}, {length: 4, rate: 2, phase: 0}, {length: 3, rate: 0, phase: 9}, {length: 1, rate: -5, phase: 6}]],
    createArm(5, 1, "red"),
    createArm(5, 1, "blue"),
    createArm(4, -2, "orange"),
    createArm(2, -5, "purple"),
    createPen("green")
  ),

  19: createLevel(
    "Orbital",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 2, rate: 3, phase: 2}, {length: 3, rate: 2, phase: 6}]],
    createArm(4, 1, "red"),
    createArm(4, 2, "blue"),
    createArm(4, -1, "orange"),
    createPen("green")
  ),

  // 0-rate arms
  20: createLevel(
    "A Stick",
    5,
    [[{length: 3, rate: 1, phase: 0}, {length: 2, rate: 1, phase: 0}, {length: 3, rate: 0, phase: 4}]],
    createArm(4, 1, "red"),
    createArm(4, 0, "blue"),
    createArm(4, -1, "orange"),
    createPen("green")
  ),

  21: createLevel(
    "Percussion",
    3,
    [[{length: 4, rate: 1, phase: 5}, {length: 3, rate: -2, phase: 6}, {length: 2, rate: -2, phase: 1}]],
    createArm(5, 1, "red"),
    createArm(4, -3, "blue"),
    createArm(3, 0, "orange"),
    createPen("green")
  ),

  22: createLevel(
    "BFFs 4eva",
    5,
    [[{length: 4, rate: 1, phase: 1}, {length: 2, rate: 3, phase: 2}, {length: 2, rate: 3, phase: 4}, {length: 2, rate: 5, phase: 5}]],
    createArm(5, 1, "red"),
    createArm(3, 2, "orange"),
    createArm(3, 0, "blue"),
    createArm(3, 2, "purple"),
    createPen("green")
  ),

  23: createLevel(
    "Hug Bud",
    5,
    [fromStringToWheelConfig("1x1+-2 3x-1+2 1x-3+0 2x-2+1")],
    createArm(2, 1, "red"),
    createArm(3, -2, "orange", 2),
    createArm(2, 0, "blue"),
    createArm(3, 1, "purple"),
    createPen("green")
  ),

  24: createLevel(
    "Hug Bud",
    5,
    [fromStringToWheelConfig("5x1+0 3x1+0 3x-7+2 2x-7+1 1x17+3")],
    createArm(6, 1, "red"),
    createArm(4, -8, "orange"),
    createArm(2, 24, "blue"),
    createArm(4, 0, "purple"),
    createArm(3, 0, "purple"),
    createPen("green")
  ),

  // You don't need to use all of them
  25: createLevel(
    "",
    5,
    []
  ),
  

  // Multiple rotations
  30: createLevel(
    "Twinkle",
    5,
    [[{length: 5, rate: 2, phase: 0}, {length: 2, rate: 0, phase: 0}, {length: 2, rate: -3, phase: 0}]],
    createArm(6, 2, "red"),
    createArm(4, -2, "orange"),
    createArm(3, -3, "blue"),
    createPen("green")
  ),

  // Multiple pens
  35: createLevel(
    "",
    5,
    []
  ),
}

export const levelStore: Writable<number> = writable(1);
export const levelNameStore: Readable<string> = derived(levelStore, level => levels[level].name);

export const answerStore: Readable<WheelConfig[][]> = derived(levelStore, level => levels[level].answer);
answerStore.subscribe(s => s.forEach(w => console.log("Answer", fromWheelConfigToString(w))))

const normalisedAnswerStore: Readable<WheelConfig[][]> = derived(answerStore, answer => answer.map(normaliseWheels));

export const answerCorrectStore: Readable<boolean> = derived(
  [normalisedAnswerStore, normalisedPenWheelConfigsStore],
  ([actual, user]) => answersMatch(actual, user));

answerCorrectStore.subscribe(correct => {
  if(correct) console.log("done");
})

export const levelCompleteStore: Writable<boolean> = writable(false);

nodesConfigStore.subscribe(() => levelCompleteStore.set(false));

export const radiusStore: Readable<number> = derived(answerStore, answers => {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length * 20)
    .reduce((a,b) => a+b, 10));
  console.log(radii);
  return Math.max(100, ...radii) * 1.25;
});
