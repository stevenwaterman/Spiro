<script lang="ts">
  import { nodeStores, selectionStore } from "$lib/state";
  import type { ArmConfig, Placement } from "$lib/types";
  import type { Writable } from "svelte/store";
  import ChildWrapper from "./ChildWrapper.svelte";

  export let parentStore: Writable<ArmConfig>;
  export let childId: string | undefined;
  export let idx: number;

  let isFirst: boolean;
  $: isFirst = idx === 0;

  let isPlacementOption: boolean;
  $: isPlacementOption =
    !isFirst && $selectionStore !== undefined && childId === undefined && $parentStore.placement !== undefined;

  let hovered: boolean = false;
  function mouseEnter() {
    hovered = true;
  }
  function mouseLeave() {
    hovered = false;
  }

  function mouseDown() {
    if (!isPlacementOption) return;

    const path = $parentStore.placement?.path ?? [];
    const placement: Placement = {
      path: [...path, idx],
      phase: 0,
      children: {},
      parent: $parentStore.id
    }

    const selectionId = $selectionStore as string;
    nodeStores[selectionId].update(conf => ({
      ...conf,
      placement
    }));

    parentStore.update(conf => {
      const placement = conf.placement as Placement;
      placement.children[idx] = $selectionStore as string;
      return conf;
    })

    selectionStore.set(undefined);
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
    background-color: rgba(0, 0, 0);
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
  }
</style>

<div
  class="node"
  class:isFirst
  class:isPlacementOption
  class:hovered
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  on:mousedown={mouseDown}
  style={`transform: rotate(${rotation ?? 0}turn);`}
>
  <div class="dot" />

  {#if isPlacementOption && hovered}
    <ChildWrapper id={$selectionStore} {idx} ghost bind:rotation/>
  {:else}
    <ChildWrapper id={childId} {idx} bind:rotation/>
  {/if}
</div>
