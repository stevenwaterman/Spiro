<script lang="ts">
  import { nodeLookupStore, placeSelection, selectedAnchorStore, selectionStore } from "$lib/state";
  import type { ArmConfig, NodeConfig } from "$lib/types";
  import ChildWrapper from "./ChildWrapper.svelte";

  export let parentConfig: ArmConfig;
  export let childConfig: NodeConfig | undefined;
  export let idx: number;
  export let anchorId: string;
  export let ghost: boolean;

  let isFirst: boolean;
  $: isFirst = idx === 0;

  let isPlacementOption: boolean;
  $: isPlacementOption = !ghost && !isFirst && $selectionStore !== undefined && childConfig === undefined && $selectedAnchorStore !== anchorId;

  let hovered: boolean = false;
  function mouseEnter() {
    hovered = true;
  }
  function mouseLeave() {
    hovered = false;
  }

  function leftClick(event: MouseEvent) {
    if (!isPlacementOption || $selectionStore == undefined) return;

    event.stopPropagation();
    placeSelection(parentConfig.id, $selectionStore, idx);
    selectionStore.set(undefined);
  }

  // function scroll(event: WheelEvent) {
  //   const placement: Placement = parentConfig.placement as Placement;
  //   if (event.deltaY > 0) {
  //     placement.phase = (placement.phase + 1) % 12;
  //     nodesConfigStore.set($nodesConfigStore);
  //   } else if (event.deltaY < 0) {
  //     placement.phase = (placement.phase - 1) % 12;
  //     nodesConfigStore.set($nodesConfigStore);
  //   }
    
  // }

  let rotation: number;
  $: if (isPlacementOption && hovered && $selectionStore) {
    const conf = $nodeLookupStore[$selectionStore];
    if (conf.type === "ARM") rotation = conf.phase / 12;
    else rotation = 0;
  } else if (childConfig?.type === "ARM") {
    rotation = childConfig.phase / 12;
  } else {
    rotation = 0;
  }
</script>

<style>
  .node {
    position: relative;

    height: 20px;
    width: 20px;
  }

  .dot {
    position: absolute;
    top: 8px;
    left: 8px;
    height: 4px;
    width: 4px;
    border-radius: 100%;
  }

  :not(.hovered).isPlacementOption .dot {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .isPlacementOption {
    cursor: pointer;
  }

  .isFirst .dot {
    background-color: var(--black);
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
  }

  .hasChild {
    z-index: 1;
  }
</style>

<div
  class="node"
  class:isFirst
  class:isPlacementOption
  class:hovered
  on:mouseenter|stopPropagation={mouseEnter}
  on:mouseleave|stopPropagation={mouseLeave}
  on:click={leftClick}
  style={`transform: rotate(${rotation}turn);`}
  class:hasChild={childConfig !== undefined}
>
  <div class="dot" />

  {#if isPlacementOption && hovered && $selectionStore}
    <ChildWrapper nodeConfig={$nodeLookupStore[$selectionStore]} {anchorId} ghost/>
  {:else if childConfig !== undefined}
    <ChildWrapper nodeConfig={childConfig} {anchorId} ghost={ghost}/>
  {/if}
</div>
