<script lang="ts">
  import { nodeStores } from "$lib/state";
  import type { ArmConfig } from "$lib/types";
  import type { Writable } from "svelte/store";

  export let id: string;

  let nodeStore: Writable<ArmConfig>;
  $: nodeStore = nodeStores[id] as Writable<ArmConfig>;
</script>

<style>
  .option {
    position: relative;
    box-sizing: content-box;
    border-radius: 20px;

    transform-origin: 10px 10px;
    width: 20px;
    height: calc(20px * var(--length))
  }

  .dot {
    position: absolute;
    border-radius: 100%;

    background-color: rgba(0, 0, 0);
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
  }

  .speed {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div
  class="option"
  style={`background-color: var(--${$nodeStore.properties.color}); --length: ${$nodeStore.properties.length}`}
>
  <div class="dot"/>
  <span class="speed">{$nodeStore.properties.rate}</span>
</div>
