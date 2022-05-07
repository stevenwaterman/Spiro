<script lang="ts">
  import { anchorIdStore, removePiece, selectionStore } from "$lib/state";
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import ArmOption from "./ArmOption.svelte";
  import PenOption from "./PenOption.svelte";

  export let nodeStore: Writable<NodeConfig>;

  let available: boolean;
  $: if ($nodeStore.placement !== undefined) {
    available = false;
  } else if ($anchorIdStore !== undefined) {
    available = true;
  } else if ($nodeStore.nodeType === "ARM") {
    available = true;
  } else {
    available = false;
  }

  function mouseDown() {
    if (!available) return;
    selectionStore.set($nodeStore.id);
  }

  function rightClick() {
    if ($nodeStore.placement === undefined) return;
    removePiece($nodeStore.id);
  }

  let gridCells: number;
  $: if($nodeStore.nodeType === "PEN") {
    gridCells = 2;
  } else {
    gridCells = $nodeStore.properties.length + 1;
  }
</script>

<style>
  .option {
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
  }

  :not(.available).option {
    display: none;
  }

  .available {
    cursor: pointer;
  }

  :not(.selected).available:hover :global(.option) {
    box-shadow: 0 0 10px yellow;
  }

  .selected :global(.option) {
    box-shadow: 0 0 10px green;
  }
</style>

{#key $nodeStore.id}
  <div
    class="option"
    class:available
    class:selected={$selectionStore === $nodeStore.id}
    on:mousedown={mouseDown}
    on:contextmenu|preventDefault|stopPropagation={rightClick}
    style={`grid-row-end: span ${gridCells}`}
  >
    {#if $nodeStore.nodeType === "ARM"}
      <ArmOption id={$nodeStore.id}/>
    {:else}
      <PenOption id={$nodeStore.id}/>
    {/if}
  </div>
{/key}