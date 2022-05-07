<script lang="ts">
  import { allNodeStores, anchorIdStore, nodeStores } from "$lib/state";
  import type { ArmConfig, NodeConfig, PenConfig } from "$lib/types";
  import { derived, type Readable, type Writable } from "svelte/store";
  import Spirograph from "./Spirograph.svelte";
  import type { PenWheelConfig, WheelConfig } from "./types";

  let nodeConfigs: NodeConfig[];
  $: nodeConfigs = $allNodeStores;

  let nodeConfigLookup: Record<string, NodeConfig>;
  $: nodeConfigLookup = nodeConfigs.reduce((acc, elem) => {acc[elem.id] = elem; return acc;}, {});

  $: console.log(nodeConfigLookup)

  let anchorId: string | undefined;
  $: anchorId = $anchorIdStore;

  let penWheelConfigs: PenWheelConfig[];
  $: penWheelConfigs = getPenWheelConfigs(nodeConfigLookup, anchorId);

  function getPenWheelConfigs(nodeConfigLookup: Record<string, NodeConfig>, anchorId: string | undefined): PenWheelConfig[] {
    if (anchorId === undefined) return [];

    const anchor: ArmConfig = nodeConfigLookup[anchorId] as ArmConfig;

    type Path = number[];
    const penPaths: Path[] = Object.values(nodeConfigLookup)
      .filter(conf => conf.nodeType === "PEN" && conf.placement !== undefined)
      .map(pen => pen.placement?.path as number[]);

    const penWheelConfigs: PenWheelConfig[] = [];
    for (const penPath of penPaths) {
      const wheelConfigs: WheelConfig[] = [];
      let node: ArmConfig = anchor;
      for (const pathLength of penPath) {
        wheelConfigs.push({
          phase: (node.placement?.phase as number) * 2 * Math.PI,
          rate: node.properties.rate,
          length: pathLength,
        });
        const nextNode = node.placement?.children?.[pathLength] as string;
        node = nodeConfigLookup[nextNode] as ArmConfig;
      }
      // HACK this isn't actually an armconfig at this point, it's a penconfig, they just both have color here
      penWheelConfigs.push({wheels: wheelConfigs, color: node.properties.color});
    }
    return penWheelConfigs;
  }

  let maxRadius: number;
  $: maxRadius = Math.max(0, 
    ...penWheelConfigs.map(
        penConfig => penConfig.wheels.map(
          wheel => wheel.length
        ).reduce((a,b) => a+b, 0))) * 20 + 10;
</script>

<svg
  viewBox={`${-maxRadius} ${-maxRadius} ${maxRadius * 2} ${maxRadius * 2}`}
  width={maxRadius * 2}
  height={maxRadius * 2}
>
  {#each penWheelConfigs as penWheelConfig}
    <Spirograph config={penWheelConfig} />
  {/each}
</svg>
