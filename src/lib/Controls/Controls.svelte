<script lang="ts">
  import { levelCompleteStore, levelStore, loadLevel } from "$lib/levels";
  import Pieces from "./Pieces.svelte";

  function keypress(event: KeyboardEvent) {
    // if (event.key === " ") {
    //   showStore.update(show => !show);
    // } else if (event.key === "Escape") {
    //   selectionStore.set(undefined);
    // }
  }

  function nextLevel() {
    loadLevel($levelStore + 1)
  }
</script>

<style>
  .controls {
    /* background: lightblue; */
    border-right: 1px solid var(--grey);

    width: 10em;
    height: 100%;
    
    display: flex;
    flex-direction: column;
  }
</style>

<svelte:body on:keydown={keypress}/>

<div class="controls">
  <Pieces/>

  {#if $levelCompleteStore}
    <button on:click={nextLevel}>Next Level</button>
  {/if}
  <!-- <input type="checkbox" bind:checked={$showStore}/> -->
</div>