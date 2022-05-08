<script lang="ts">
  import { answerStore, radiusStore } from "$lib/levels";
  import { anchorIdStore, nodeStoresWrapped } from "$lib/state";
  import type { ArmConfig, NodeConfig } from "$lib/types";
  import { identity } from "svelte/internal";
  import { derived, type Readable, type Writable } from "svelte/store";
  import Spirograph from "./Spirograph.svelte";
  import SpirographAnswer from "./SpirographAnswer.svelte";
  import type { PenWheelConfig, WheelConfig } from "./types";

  let nodeStores: Writable<NodeConfig>[];
  $: nodeStores = Object.values($nodeStoresWrapped);

  let combinedStore: Readable<NodeConfig[]>;
  $: combinedStore = derived(nodeStores, identity);

  let nodeConfigLookup: Record<string, NodeConfig>;
  $: nodeConfigLookup = $combinedStore.reduce((acc, elem) => {acc[elem.id] = elem; return acc;}, {});

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
        const prevPhase = wheelConfigs.length === 0 ? 0 : wheelConfigs[wheelConfigs.length - 1].phase;
        const prevRate = wheelConfigs.length === 0 ? 0 : wheelConfigs[wheelConfigs.length - 1].rate;
        wheelConfigs.push({
          phase: prevPhase + (node.placement?.phase as number) * 2 * Math.PI,
          rate: prevRate + node.properties.rate,
          length: pathLength,
        });
        const nextNode = node.placement?.children?.[pathLength] as string;
        node = nodeConfigLookup[nextNode] as ArmConfig;
      }
      // HACK this isn't actually an armconfig at this point, it's a penconfig, they just both have color here
      penWheelConfigs.push({wheels: wheelConfigs, color: node.properties.color, penId: node.id});
    }
    return penWheelConfigs;
  }
</script>

<svg
  viewBox={`${-$radiusStore} ${-$radiusStore} ${$radiusStore * 2} ${$radiusStore * 2}`}
  width={$radiusStore * 2}
  height={$radiusStore * 2}
>
  {#each $answerStore as answer}
    <SpirographAnswer config={answer}/>
  {/each}

  {#each penWheelConfigs as penWheelConfig (penWheelConfig.penId)}
    <Spirograph config={penWheelConfig} />
  {/each}
</svg>
