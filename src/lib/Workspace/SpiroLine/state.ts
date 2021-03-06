import { normaliseWheels } from "$lib/solution";
import { nodeLookupStore } from "$lib/state";
import { isParentPos, isPen, type ArmConfig, type NodeConfig, type PenConfig } from "$lib/types";
import { derived, type Readable } from "svelte/store";
import type { PenWheelConfig, WheelConfig } from "./types";

export const penWheelConfigsStore: Readable<Record<string, PenWheelConfig[]>> = derived(nodeLookupStore, nodeLookup => {
  const nodes: NodeConfig[] = Object.values(nodeLookup)
  const pens: PenConfig[] = nodes.filter(isPen);
  const penWheelConfigs: PenWheelConfig[] = pens.map(pen => getPenWheelConfig(pen, nodeLookup));
  return penWheelConfigs.reduce((acc, elem) => {
    if(acc[elem.anchorId] === undefined) acc[elem.anchorId] = [];
    acc[elem.anchorId].push(elem);
    return acc;
  }, {} as Record<string, PenWheelConfig[]>);
});

function getPenWheelConfig(pen: PenConfig, nodeLookup: Record<string, NodeConfig>): PenWheelConfig {
  const config = getWheelConfig(pen, nodeLookup);
  return {
    penId: pen.id,
    anchorId: config.anchorId,
    color: pen.color,
    wheels: config.wheels
  };
}

function getWheelConfig(nodeConfig: NodeConfig, nodeLookup: Record<string, NodeConfig>): {wheels: WheelConfig[], anchorId: string} {
  if (!isParentPos(nodeConfig)) return {wheels: [], anchorId: nodeConfig.id};

  const armConfig = nodeLookup[nodeConfig.parent.id] as ArmConfig;
  const newWheel: WheelConfig = { 
    length: nodeConfig.parent.idx,
    rate: armConfig.rate,
    phase: armConfig.phase
  };

  const config = getWheelConfig(armConfig, nodeLookup);
  const wheels = config.wheels;
  
  if (wheels.length > 0) {
    const lastWheel = wheels[wheels.length - 1];
    newWheel.rate += lastWheel.rate;
  }

  wheels.push(newWheel);
  return config;
}

export const normalisedPenWheelConfigsStore: Readable<Record<string, WheelConfig[][]>> = derived(penWheelConfigsStore, anchors => {
  const output: Record<string, WheelConfig[][]> = {};
  Object.entries(anchors).forEach(([id, configs]) => {
    output[id] = configs.map(config => normaliseWheels(config.wheels));
  })
  return output;
});
