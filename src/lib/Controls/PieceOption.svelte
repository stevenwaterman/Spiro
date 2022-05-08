<script lang="ts">
  import { anchorIdStore, removePiece, selectionStore } from "$lib/state";
  import type { NodeConfig } from "$lib/types";
  import ArmOption from "./ArmOption.svelte";
  import PenOption from "./PenOption.svelte";

  export let nodeConfig: NodeConfig;

  let available: boolean;
  $: if (nodeConfig.placement !== undefined) {
    available = false;
  } else if (nodeConfig.nodeType === "ARM" || $anchorIdStore !== undefined) {
    available = true;
  } else {
    available = false;
  }

  function mouseDown() {
    if (!available) return;
    selectionStore.set(nodeConfig.id);
  }

  function rightClick() {
    if (nodeConfig.placement === undefined) return;
    removePiece(nodeConfig.id);
  }

  let gridCells: number;
  $: if(nodeConfig.nodeType === "PEN") {
    gridCells = 2;
  } else {
    gridCells = nodeConfig.properties.length + 1;
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

{#key nodeConfig.id}
  <div
    class="option"
    class:available
    class:selected={$selectionStore === nodeConfig.id}
    on:mousedown={mouseDown}
    on:contextmenu|preventDefault|stopPropagation={rightClick}
    style={`grid-row-end: span ${gridCells}`}
  >
    {#if nodeConfig.nodeType === "ARM"}
      <ArmOption id={nodeConfig.id}/>
    {:else}
      <PenOption id={nodeConfig.id}/>
    {/if}
  </div>
{/key}