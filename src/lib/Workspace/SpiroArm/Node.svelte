<script lang="ts">
  import { placeSelection, selectedAnchorStore, selectionStore } from "$lib/state";
  import { isArm, type ArmConfig, type NodeConfig } from "$lib/types";
  import ChildWrapper from "./ChildWrapper.svelte";

  export let parentConfig: ArmConfig;
  export let childConfig: NodeConfig | undefined;
  export let idx: number;
  export let anchorId: string;
  export let parentPhase: number;

  let isFirst: boolean;
  $: isFirst = idx === 0;

  let isPlacementOption: boolean;
  $: isPlacementOption = 
    !isFirst && 
    $selectionStore !== undefined && 
    childConfig === undefined && 
    $selectedAnchorStore !== anchorId;

  function leftClick(event: MouseEvent) {
    if (!isPlacementOption || $selectionStore == undefined) return;

    event.stopPropagation();
    placeSelection(parentConfig.id, $selectionStore, idx);
    selectionStore.set(undefined);
  }

  let phase: number;
  $: phase = isArm(childConfig) ? childConfig.phase / 12 : 0;
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
    background-color: var(--black);
    opacity: 0;
  }

  .isPlacementOption:hover .dot {
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
    opacity: 1;
  }

  .isPlacementOption .dot {
    opacity: 0.5;
  }

  .isPlacementOption {
    cursor: pointer;
  }

  .isFirst .dot {
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
    opacity: 1;
  }

  .hasChild {
    z-index: 1;
  }
</style>

<div
  class="node"
  class:isFirst
  class:isPlacementOption
  on:click={leftClick}
  style={`transform: rotate(${phase - parentPhase}turn);`}
  class:hasChild={childConfig !== undefined}
>
  <div class="dot" />

  <ChildWrapper nodeConfig={childConfig} {anchorId} parentPhase={phase}/>
</div>
