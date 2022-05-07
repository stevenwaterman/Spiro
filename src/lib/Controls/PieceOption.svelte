<script lang="ts">
  import { anchorIdStore, selectionStore } from "$lib/state";
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";

  export let nodeStore: Writable<NodeConfig>;

  let available: boolean;
  $: if ($nodeStore.placement !== undefined) {
    available = false;
  } else if ($anchorIdStore !== undefined) {
    available = true;
  } else if ($nodeStore.nodeType === "ARM") {
    available = true;
  } else {
    available = false;
  }

  function mouseDown() {
    if (!available) return;

    if ($anchorIdStore === undefined) {
      anchorIdStore.set($nodeStore.id);
      nodeStore.update(config => ({
        ...config,
        placement: {
          phase: 0,
          path: [],
          children: {},
          parent: undefined
        }
      }));
    } else {
      selectionStore.set($nodeStore.id);
    }
  }
</script>

<style>
  .option {
    height: 8em;
    width: 8em;
    border: 2px solid grey;
    margin: 1em;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  :not(.available).option {
    background-color: lightgray;
  }

  .available {
    cursor: pointer;
  }

  :not(.selected).available:hover {
    background-color: lightyellow;
  }

  .selected {
    background-color: lightgreen;
  }
</style>

<div
  class="option"
  class:available
  class:selected={$selectionStore === $nodeStore.id}
  on:mousedown={mouseDown}
>
  {$nodeStore.id}
</div>