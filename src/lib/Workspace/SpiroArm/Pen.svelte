<script lang="ts">
  import { removePiece, selectionStore } from "$lib/state";
  import type { PenConfig } from "$lib/types";
  
  export let nodeConfig: PenConfig;
  export let anchorId: string;

  function leftClick() {
    removePiece(nodeConfig.id);
    selectionStore.set(nodeConfig.id);
  }
</script>

<style>
  .pen {
    height: 8px;
    width: 8px;
    border-radius: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .pen:not(.ghost) {
    cursor: pointer;
  }
</style>

<div
  class="pen"
  style={`background-color: var(--${nodeConfig.color})`}
  on:click|stopPropagation={leftClick}
/>
