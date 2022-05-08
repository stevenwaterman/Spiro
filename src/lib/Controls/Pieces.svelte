<script lang="ts">
  import { nodesConfigStore } from "$lib/state";
  import PieceOption from "./PieceOption.svelte";
</script>

<style>
  .pieces {
    width: 100%;

    display: grid;
    column-gap: 10px;
    grid-template-columns: repeat(auto-fill, 40px);
    grid-auto-rows: 20px;
  }
</style>

<div class="pieces">
  {#each Object.values($nodesConfigStore) as nodeConfig}
    <PieceOption nodeConfig={nodeConfig}/>
  {/each}
</div>