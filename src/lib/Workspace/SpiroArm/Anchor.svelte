<script lang="ts">
  import type { ArmConfig, NodeConfig } from "$lib/types";
  import ChildWrapper from "./ChildWrapper.svelte";
  import {answerStore, durationStore, levelCompleteStore, radiusStore} from "$lib/levels";
  import type { PenWheelConfig } from "../SpiroLine/types";
  import { penWheelConfigsStore } from "../SpiroLine/state";
  import Spirograph from "../SpiroLine/Spirograph.svelte";
  import SpirographAnswer from "../SpiroLine/SpirographAnswer.svelte";
  import { nodeLookupStore } from "$lib/state";

  export let nodeConfig: NodeConfig;
  export let primary: boolean = false; 

  let anchorId: string;
  $: anchorId = nodeConfig.id;

  let anchor: NodeConfig;
  $: anchor = $nodeLookupStore[anchorId];

  let rotation: number;
  $: rotation = nodeConfig.type === "ARM" ? nodeConfig.phase / 12 : 0; 

  let penWheelConfigs: PenWheelConfig[];
  $: penWheelConfigs = $penWheelConfigsStore[nodeConfig.id] ?? [];

  function getLength(arm: ArmConfig, nodeLookup: Record<string, NodeConfig>): number {
    const children = Object.values(nodeLookup).filter(node => node.parent?.id === arm.id && node.type === "ARM") as ArmConfig[];
    const childLengths = children.map(child => (child.parent?.idx ?? 0) + getLength(child, nodeLookup));
    const longest = Math.max(arm.length, ...childLengths);
    return longest;
  }

  let length: number;
  $: length = anchor.type === "ARM" ? getLength(anchor, $nodeLookupStore) : 0;

  let unitRadius: number;
  $: if (primary) {
    unitRadius = Math.max(length, $radiusStore);
  } else {
    unitRadius = length;
  }

  let radius: number;
  $: radius = Math.max(100, unitRadius * 20)
</script>

<style>
  .anchor {
    position: relative;
    transition-property: opacity;
    transition-duration: 1s;
  }

  .hide {
    opacity: 0;
  }

  svg {
    pointer-events: none;
  }

  .center {
    position: absolute;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
    width: 0;
    height: 0;
    transform-origin: 10px 10px;
  }
</style>

<div class="anchor" style={`--duration: ${$durationStore};`}>
  <svg
    viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
    width={radius * 2}
    height={radius * 2}
  >
    {#if !$levelCompleteStore && nodeConfig.id === "A"}
      {#each $answerStore as answer}
        <SpirographAnswer config={answer}/>
      {/each}
    {/if}

    {#each penWheelConfigs as penWheelConfig, idx (penWheelConfig.penId)}
      <Spirograph config={penWheelConfig} {idx} />
    {/each}
  </svg>

  <div
    class="center"
    style={`transform: rotate(${rotation}turn);`}
    class:hide={$levelCompleteStore}
  >
    <ChildWrapper nodeConfig={nodeConfig} {anchorId} />
  </div>
</div>
