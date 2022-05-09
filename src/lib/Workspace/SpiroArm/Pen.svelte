<script lang="ts">
  import { removePiece, selectionStore } from "$lib/state";
  import type { PenConfig } from "$lib/types";
  
  export let nodeConfig: PenConfig;
  export let anchorId: string;
  export let ghost: boolean;


  function rightClick() {
    removePiece(nodeConfig.id);
  }

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

  .ghost {
    opacity: 0.5;
    pointer-events: none;
  }
</style>

<div
  class="pen"
  class:ghost
  style={`background-color: var(--${nodeConfig.color})`}
  on:contextmenu|preventDefault|stopPropagation={rightClick}
  on:click|stopPropagation={leftClick}
/>
