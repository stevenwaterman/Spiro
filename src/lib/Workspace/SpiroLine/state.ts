import { normaliseWheels } from "$lib/solution";
import { anchorIdStore, nodesConfigStore } from "$lib/state";
import type { NodeConfig, ArmConfig } from "$lib/types";
import { deriveUnwrapRecord } from "$lib/utils";
import { derived, type Readable } from "svelte/store";
import type { PenWheelConfig, WheelConfig } from "./types";

export const penWheelConfigsStore: Readable<PenWheelConfig[]> = derived(
  [anchorIdStore, nodesConfigStore],
  ([anchorId, nodeConfigLookup]) => {
    if (anchorId === undefined) return [];

    const anchor: ArmConfig = nodeConfigLookup[anchorId] as ArmConfig;

    return Object.values(nodeConfigLookup)
      .filter(conf => conf?.nodeType === "PEN" && conf.placement !== undefined)
      .map(pen => pen?.placement?.path as number[])
      .map(path => {
        const wheelConfigs: WheelConfig[] = [];
        let node: NodeConfig | undefined = anchor;
        if (node === undefined) return null; // invalid state

        for (const pathLength of path) {
          const prevPhase = wheelConfigs.length === 0 ? 0 : wheelConfigs[wheelConfigs.length - 1].phase;
          const prevRate = wheelConfigs.length === 0 ? 0 : wheelConfigs[wheelConfigs.length - 1].rate;
          wheelConfigs.push({
            phase: prevPhase + (node.placement?.phase as number) * 2 * Math.PI,
            rate: prevRate + node.properties.rate,
            length: pathLength,
          });
          const nextNode = node.placement?.children?.[pathLength] as string;
          node = nodeConfigLookup[nextNode] as ArmConfig;
          if (node === undefined) return null; // invalid state
        }

        // HACK this isn't actually an armconfig at this point, it's a penconfig, they just both have color here
        return { wheels: wheelConfigs, color: node.properties.color, penId: node.id };
      })
      .filter(config => config !== null) as PenWheelConfig[];
  });

export const normalisedPenWheelConfigsStore: Readable<WheelConfig[][]> = derived(penWheelConfigsStore, penWheels => penWheels.map(pen => normaliseWheels(pen.wheels)));
