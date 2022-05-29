<script lang="ts">
  import { isArm, isArmParent, isPrimaryPos, type ArmConfig, type NodeConfig, type NodeConfigPositioned } from "$lib/types";
  import ChildWrapper from "./ChildWrapper.svelte";
  import {durationStore, levelCompleteStore, normalisedAnswerStore, radiusStore} from "$lib/levels";
  import type { PenWheelConfig } from "../SpiroLine/types";
  import { penWheelConfigsStore } from "../SpiroLine/state";
  import Spirograph from "../SpiroLine/Spirograph.svelte";
  import SpirographAnswer from "../SpiroLine/SpirographAnswer.svelte";
  import { nodeLookupStore, selectionStore, showStore } from "$lib/state";

  export let nodeConfig: NodeConfigPositioned<"PRIMARY" | "SECONDARY">;

  let primary: boolean; 
  $: primary = isPrimaryPos(nodeConfig);

  let selected: boolean;
  $: selected = $selectionStore === nodeConfig.id;

  let left: number;
  $: left = primary ? 50 : nodeConfig.parent["left"];

  let top: number;
  $: top = primary ? 50 : nodeConfig.parent["top"];

  let rotation: number;
  $: rotation = isArm(nodeConfig) ? nodeConfig.phase / 12 : 0; 

  let penWheelConfigs: PenWheelConfig[];
  $: penWheelConfigs = $penWheelConfigsStore[nodeConfig.id] ?? [];

  function getLength(arm: ArmConfig, nodeLookup: Record<string, NodeConfig>): number {
    const childLengths = Object.values(nodeLookup)
      .filter(isArmParent)
      .filter(node => node.parent.id === arm.id)
      .map(child => child.parent.idx + getLength(child, nodeLookup));
    return Math.max(arm.length, ...childLengths);
  }

  let length: number;
  $: length = isArm(nodeConfig) ? getLength(nodeConfig, $nodeLookupStore) : 0;

  let radius: number;
  $: if (primary) {
    radius = Math.max(length, $radiusStore) * 20;
  } else {
    radius = length * 20;
  }
</script>

<style>
  .anchor {
    position: absolute;
    width: 0;
    height: 0;
    transform: scale(var(--scale));
    z-index: 0;
  }

  .hide {
    opacity: 0;
    pointer-events: none;
  }

  svg {
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .center {
    position: absolute;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
    width: 0;
    height: 0;
    transform-origin: 10px 10px;
    transition-property: opacity;
    transition-duration: 500ms;
  }

  .selected {
    opacity: 0.5;
    pointer-events: none;
    z-index: 2;
  }

  :not(.primary) {
    z-index: 1;
  }

  .selected svg {
    opacity: 0;
  }
</style>

<div
  class="anchor"
  class:selected
  class:primary
  style={`
    --duration: ${$durationStore};
    left: ${left}%;
    top: ${top}%;
  `}
>
  <svg
    viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
    width={radius * 2}
    height={radius * 2}
  >
    {#if !$levelCompleteStore && primary}
      {#each $normalisedAnswerStore as answer}
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
    <ChildWrapper nodeConfig={nodeConfig} anchorId={nodeConfig.id} parentPhase={rotation} />
  </div>
</div>
