<script lang="ts">
  import { nodesConfigStore, placeSelection, selectionStore } from "$lib/state";
  import type { ArmConfig, Placement } from "$lib/types";
  import type { Writable } from "svelte/store";
  import ChildWrapper from "./ChildWrapper.svelte";

  export let parentConfig: ArmConfig;
  export let childId: string | undefined;
  export let idx: number;

  let isFirst: boolean;
  $: isFirst = idx === 0;

  let isPlacementOption: boolean;
  $: isPlacementOption =
    !isFirst && $selectionStore !== undefined && childId === undefined && parentConfig.placement !== undefined;

  let hovered: boolean = false;
  function mouseEnter() {
    hovered = true;
  }
  function mouseLeave() {
    hovered = false;
  }

  function leftClick(event: MouseEvent) {
    if (!isPlacementOption) return;

    event.stopPropagation();
    placeSelection(parentConfig.id, $selectionStore as string, idx);
    selectionStore.set(undefined);
  }

  function scroll(event: WheelEvent) {
    const placement: Placement = parentConfig.placement as Placement;
    if (event.deltaY > 0) {
      placement.phase = (placement.phase + 0.125) % 1;
      nodesConfigStore.set($nodesConfigStore);
    } else if (event.deltaY < 0) {
      placement.phase = (placement.phase - 0.125) % 1;
      nodesConfigStore.set($nodesConfigStore);
    }
    
  }

  let rotation: number | undefined = undefined;
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
  on:wheel|stopPropagation={scroll}
  style={`transform: rotate(${rotation ?? 0}turn);`}
  class:hasChild={childId !== undefined}
>
  <div class="dot" />

  {#if isPlacementOption && hovered}
    <ChildWrapper id={$selectionStore} ghost bind:rotation/>
  {:else}
    <ChildWrapper id={childId} bind:rotation/>
  {/if}
</div>
