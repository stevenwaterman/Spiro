<script lang="ts">
  import { isArm, isArmParent, isParentPos, isPrimaryPos, type ArmConfig, type NodeConfig, type NodeConfigPositioned } from "$lib/types";
  import ChildWrapper from "./ChildWrapper.svelte";
  import {answerStore, durationStore, levelCompleteStore, radiusStore} from "$lib/levels";
  import type { PenWheelConfig } from "../SpiroLine/types";
  import { penWheelConfigsStore } from "../SpiroLine/state";
  import Spirograph from "../SpiroLine/Spirograph.svelte";
  import SpirographAnswer from "../SpiroLine/SpirographAnswer.svelte";
  import { nodeLookupStore, selectionStore } from "$lib/state";

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
    position: absolute;
    transition-property: opacity;
    transition-duration: 1s;
    transform: translate(-50%, -50%)
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

  .selected {
    opacity: 0.5;
    pointer-events: none;
  }
</style>

<div
  class="anchor"
  class:selected
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
    <ChildWrapper nodeConfig={nodeConfig} anchorId={nodeConfig.id} />
  </div>
</div>
