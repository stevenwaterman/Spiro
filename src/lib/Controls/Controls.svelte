<script lang="ts">
  import { nodeStores, showStore } from "$lib/state";
  import PieceOption from "./PieceOption.svelte";
</script>

<style>
  .controls {
    background: lightblue;
    border-right: 1px solid grey;

    width: 10em;
    height: 100%;
    
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
  }

  .pieces {
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
  }
</style>

<div class="controls">
  <div class="pieces">
    {#each Object.values(nodeStores) as nodeStore}
      <PieceOption nodeStore={nodeStore}/>
    {/each}
  </div>

  <input type="checkbox" bind:checked={$showStore}/>
</div>