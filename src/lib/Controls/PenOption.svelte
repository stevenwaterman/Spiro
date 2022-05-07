<script lang="ts">
  import { anchorIdStore, nodeStores, removePiece } from "$lib/state";
  import type { PenConfig, Placement } from "$lib/types";

  import type { Writable } from "svelte/store";
  
  export let id: string;

  let nodeStore: Writable<PenConfig>;
  $: nodeStore = nodeStores[id] as Writable<PenConfig>;
</script>

<style>
  .option {
    height: 12px;
    width: 12px;
    border-radius: 100%;
  }
</style>

<div
  class="option"
  style={`background-color: var(--${$nodeStore.properties.color})`}
/>
