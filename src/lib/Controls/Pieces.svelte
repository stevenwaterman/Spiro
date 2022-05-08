<script lang="ts">
  import { nodeStoresWrapped } from "$lib/state";
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import PieceOption from "./PieceOption.svelte";

  let nodeStoresMap: Record<string, Writable<NodeConfig>>;
  $: nodeStoresMap = $nodeStoresWrapped

  let nodeStores: Writable<NodeConfig>[];
  $: nodeStores = Object.values(nodeStoresMap);
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
  {#each nodeStores as nodeStore}
    <PieceOption nodeStore={nodeStore}/>
  {/each}
</div>