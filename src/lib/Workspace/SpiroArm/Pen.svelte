<script lang="ts">
  import { nodesConfigStore, removePiece, selectionStore } from "$lib/state";
  import type { PenConfig } from "$lib/types";
  
  export let id: string;
  export let ghost: boolean;

  let penConfig: PenConfig;
  $: penConfig = $nodesConfigStore[id] as PenConfig;

  function rightClick() {
    removePiece(id);
  }

  function leftClick() {
    removePiece(id);
    selectionStore.set(id);
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
  style={`background-color: var(--${penConfig.properties.color})`}
  on:contextmenu|preventDefault|stopPropagation={rightClick}
  on:click|stopPropagation={leftClick}
/>
