import { derived, writable, type Readable, type Writable } from "svelte/store";
import { answersMatch, fromStringToWheelConfig, normaliseWheels } from "./solution";
import { nodeLookupStore, showStore } from "./state";
import { isArm, isSecondaryPos, type ArmConfig, type Color, type Length, type NodeConfig, type PenConfig, type Phase, type Rates } from "./types";
import { clone } from "./utils";
import { normalisedPenWheelConfigsStore } from "./Workspace/SpiroLine/state";
import type { WheelConfig } from "./Workspace/SpiroLine/types";

type Level = {
  name: string;
  answer: WheelConfig[][];
  pieces: Record<string, NodeConfig>;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const armColors: Color[] = ["red", "orange", "blue", "purple", "yellow", "white"];

function createLevel(name: string, answer: WheelConfig[][], ...nodes: NodeConfig[][]): Level {
  const nodeConfigs = nodes.flat();
  nodeConfigs.push(...createPen("green"));
  
  nodeConfigs.forEach((node, idx) => {
    if (isArm(node)) node.color = armColors[idx % 6];
  });

  const primaryAnchor = nodeConfigs.find(isArm);
  if (primaryAnchor !== undefined) primaryAnchor.parent = {type: "PRIMARY"};

  const pieces: Record<string, NodeConfig> = {};
  nodeConfigs.forEach((node, idx) => {
    node.id = alphabet[idx];
    pieces[node.id] = node;

    if (isSecondaryPos(node)) {
      node.parent.left = 10;
      node.parent.top = 10 + 80 * idx / nodeConfigs.length
    }
  });

  return {
    name,
    answer,
    pieces
  };
}

function createArm(length: Length, rate: Rates, phase: Phase = 0, count?: number): ArmConfig[] {
  const output: ArmConfig[] = [];
  for (let i = 0; i < (count ?? 1); i++) {
    output.push({
      id: "TODO",
      type: "ARM",
      parent: { type: "SECONDARY", left: 0, top: 0 },

      length,
      rate,
      color: "black",
      phase
    });
  }
  return output;
}

function createPen(color: Color): PenConfig[] {
  return [{
    id: "TODO",
    type: "PEN",
    parent: {
      type: "SECONDARY",
      left: 0,
      top: 0
    },

    color
  }];
}

const levels: Record<number, Level> = {
  // Starting
  1: createLevel(
    "Starting Simple",
    [[{length: 1, rate: 1, phase: 0}]],
    createArm(2, 1)
  ),

  // You can join multiple arms together. Length exists
  2: createLevel(
    "Teamwork",
    [[{length: 2, rate: 1, phase: 0}, {length: 1, rate: 2, phase: 0}]],
    createArm(3, 1),
    createArm(2, 1)
  ),

  // Building up to a more complicated challenge
  3: createLevel(
    "Lengthy Lesson",
    [[{length: 2, rate: 1, phase: 0}, {length: 4, rate: 2, phase: 0}]],
    createArm(4, 1),
    createArm(5, 1)
  ),

  // Combining everything so far
  4: createLevel(
    "All Together",
    [fromStringToWheelConfig("1x1+0 2x2+0 3x3+0")],
    createArm(2, 1),
    createArm(3, 1),
    createArm(4, 1)
  ),
  // 4: createLevel(
  //   "All Together",
  //   3,
  //   [[{length: 3, rate: 1, phase: 0}, {length: 1, rate: 2, phase: 0}, {length: 3, rate: 3, phase: 0}]],
  //   createArm(4, 1),
  //   createArm(4, 1),
  //   createArm(3, 1),
  //   createPen("green")
  // ),

  // Different Speeds Exist
  5: createLevel(
    "Speedy Session",
    [[{length: 5, rate: 1, phase: 0}, {length: 2, rate: 5, phase: 0}]],
    createArm(6, 1),
    createArm(3, 4)
  ),

  6: createLevel(
    "Spin Slightly",
    [[{length: 3, rate: 1, phase: 0}, {length: 4, rate: 4, phase: 0}]],
    createArm(5, 1),
    createArm(5, 3)
  ),

  7: createLevel(
    "Spin Crazy",
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 13, phase: 0}]],
    createArm(6, 1),
    createArm(4, 12)
  ),

  8: createLevel(
    "Getting Rapid",
    [[{length: 9, rate: 1, phase: 0}, {length: 5, rate: 7, phase: 0}, {length: 1, rate: 31, phase: 0}]],
    createArm(10, 1),
    createArm(6, 6),
    createArm(3, 24)
  ),

  9: createLevel(
    "Flux Capacitor",
    [[{length: 5, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}, {length: 2, rate: 3, phase: 0}, {length: 1, rate: 6, phase: 0}]],
    createArm(6, 1),
    createArm(4, 1),
    createArm(3, 1),
    createArm(3, 3)
  ),

  // Introducing negative speeds
  10: createLevel(
    "Going Both Ways",
    [[{length: 2, rate: 1, phase: 0}, {length: 3, rate: 0, phase: 0}]],
    createArm(4, 1),
    createArm(5, -1)
  ),

  11: createLevel(
    "Squishy",
    [[{length: 4, rate: 1, phase: 0}, {length: 2, rate: -1, phase: 0}]],
    createArm(5, -1),
    createArm(4, 2)
  ),

  12: createLevel(
    "'Peach'",
    [[{length: 4, rate: 1, phase: 0}, {length: 2, rate: 2, phase: 0}, {length: 3, rate: 0, phase: 0}]],
    createArm(5, 1),
    createArm(3, 1),
    createArm(4, -2)
  ),

  13: createLevel(
    "Windmill",
    [[{length: 5, rate: 1, phase: 0}, {length: 5, rate: -2, phase: 0}]],
    createArm(6, -1),
    createArm(6, 3)
  ),

  14: createLevel(
    "Fishy",
    [[{length: 5, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 0}, {length: 5, rate: -1, phase: 0}]],
    createArm(6, -1),
    createArm(4, -1),
    createArm(6, 3)
  ),

  // Introducing Phase
  15: createLevel(
    "It's Just A Phase",
    [[{length: 3, rate: 1, phase: 0}, {length: 3, rate: 2, phase: 3}]],
    createArm(4, 1),
    createArm(4, 1, 3)
  ),

  16: createLevel(
    "Spectacle",
    [[{length: 3, rate: 1, phase: 4}, {length: 3, rate: 2, phase: 5}, {length: 4, rate: 4, phase: 7}]],
    createArm(4, 1, 4),
    createArm(4, 1, 5),
    createArm(5, 2, 7)
  ),

  17: createLevel(
    "Dice",
    [[{length: 8, rate: 1, phase: 3}, {length: 3, rate: 5, phase: 3}, {length: 2, rate: -3, phase: 9}]],
    createArm(9, 1, 2),
    createArm(4, 4, 10),
    createArm(3, -8, 0)
  ),

  18: createLevel(
    "Subscribe",
    [[{length: 4, rate: 1, phase: 2}, {length: 4, rate: 2, phase: 4}, {length: 3, rate: 0, phase: 9}, {length: 1, rate: -5, phase: 8}]],
    createArm(5, 1, 2),
    createArm(5, 1, 4),
    createArm(4, -2, 9),
    createArm(2, -5, 8)
  ),

  19: createLevel(
    "Orbital",
    [[{length: 3, rate: 1, phase: 0}, {length: 2, rate: 3, phase: 2}, {length: 3, rate: 2, phase: 6}]],
    createArm(4, 1),
    createArm(4, 2, 2),
    createArm(4, -1, 6)
  ),

  // 0-rate arms
  20: createLevel(
    "Just a Stick",
    [[{length: 3, rate: 1, phase: 0}, {length: 2, rate: 1, phase: 0}, {length: 3, rate: 0, phase: 4}]],
    createArm(4, 1),
    createArm(4, 0),
    createArm(4, -1, 4)
  ),

  21: createLevel(
    "Percussion",
    [[{length: 6, rate: 1, phase: 1}, {length: 3, rate: -2, phase: 3}, {length: 1, rate: -2, phase: 11}, {length: 2, rate: -2, phase: 10}]],
    createArm(7, 1, 2),
    createArm(4, -3, 1),
    createArm(2, 0, 9),
    createArm(3, 0, 8)
  ),

  22: createLevel(
    "Feeling Loopy",
    [[{length: 4, rate: 1, phase: 1}, {length: 2, rate: 3, phase: 2}, {length: 2, rate: 3, phase: 4}, {length: 2, rate: 5, phase: 5}]],
    createArm(5, 1, 1),
    createArm(3, 2, 2),
    createArm(3, 0, 4),
    createArm(3, 2, 5)
  ),

  23: createLevel(
    "Hug Bud",
    [fromStringToWheelConfig("1x1+-2 2x-1+2 1x-1+2 1x-3+0 2x-2+1")],
    createArm(2, 1, 10),
    createArm(3, -2, 2),
    createArm(2, 0, 2),
    createArm(2, -2, 0),
    createArm(3, 1, 1)
  ),

  24: createLevel(
    "Gone Where?",
    [fromStringToWheelConfig("5x1+0 3x1+0 3x-7+2 2x-7+1 1x17+3")],
    createArm(6, 1),
    createArm(4, 0),
    createArm(4, -8, 2),
    createArm(3, 0, 1),
    createArm(2, 24, 3)
  ),

  // Multiple rotations
  25: createLevel(
    "Another One",
    [[{length: 5, rate: 2, phase: 0}, {length: 2, rate: 0, phase: 0}, {length: 2, rate: -3, phase: 0}]],
    createArm(6, 2),
    createArm(3, -2),
    createArm(3, -3)
  ),

  26: createLevel(
    "Another One",
    [fromStringToWheelConfig("4x2+0 3x5+2 2x5+4")],
    createArm(5, 2),
    createArm(4, 3, 2),
    createArm(3, 0, 4)
  ),

  27: createLevel(
    "Another One",
    [fromStringToWheelConfig("4x2+0 3x5+2 2x5+4")],
    createArm(5, 2),
    createArm(4, 3, 2),
    createArm(3, 0, 4)
  ),

  // You don't need to use all of them
  30: createLevel(
    "Superfluous",
    [fromStringToWheelConfig("4x1+2 3x-2+5")],
    createArm(5, 1, 2),
    createArm(4, -3, 5),
    createArm(3, 2, 3)
  ),

  // Multiple pens
  35: createLevel(
    "",
    []
  ),
}

export const levelNumberStore: Writable<number> = writable(1);
levelNumberStore.subscribe(() => showStore.set(false));

export const levelStore: Readable<Level> = derived(levelNumberStore, levelNumber => levels[levelNumber]);

levelStore.subscribe(level => {
  nodeLookupStore.set(clone(level.pieces));
});

export const levelNameStore: Readable<string> = derived(levelStore, level => level.name);
export const answerStore: Readable<WheelConfig[][]> = derived(levelStore, level => level.answer);
export const normalisedAnswerStore: Readable<WheelConfig[][]> = derived(answerStore, answer => answer.map(normaliseWheels));

export const durationStore: Readable<number> = derived(normalisedAnswerStore, answers => {
  const rotations = answers.map(answer => answer
    .map(wheel => Math.abs(wheel.rate))
    .reduce((a,b) => a+b, 0));

  const fastest = Math.max(0, ...rotations);
  return Math.pow(fastest, 0.6);
});

export const answerCorrectStore: Readable<boolean> = derived(
  [normalisedAnswerStore, normalisedPenWheelConfigsStore],
  ([actual, user]) => Object.values(user).some(pens => answersMatch(actual, pens)));

export const levelCompleteStore: Writable<boolean> = writable(false);
nodeLookupStore.subscribe(() => levelCompleteStore.set(false));

function getRadius(answers: WheelConfig[][]): number {
  const radii = answers.map(answer => answer
    .map(wheel => wheel.length)
    .reduce((a,b) => a+b, 1));
  return Math.max(1, ...radii);
}
export const radiusStore: Readable<number> = derived(answerStore, getRadius);
