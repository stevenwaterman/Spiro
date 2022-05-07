<script lang="ts">
  import { selectionStore, showStore } from "$lib/state";
  import Pieces from "./Pieces.svelte";

  function keypress(event: KeyboardEvent) {
    if (event.key === " ") {
      showStore.update(show => !show);
    } else if (event.key === "Escape") {
      selectionStore.set(undefined);
    }
  }
</script>

<style>
  .controls {
    background: lightblue;
    border-right: 1px solid grey;

    width: 10em;
    height: 100%;
    
    display: flex;
    flex-direction: column;
  }
</style>

<svelte:body on:keydown={keypress}/>

<div class="controls">
  <Pieces/>

  <input type="checkbox" bind:checked={$showStore}/>
</div>