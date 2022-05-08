<script lang="ts">
  import { getNodeStore } from "$lib/state";
  import type { ArmConfig } from "$lib/types";
  import type { Writable } from "svelte/store";

  export let id: string;

  let nodeStore: Writable<ArmConfig>;
  $: nodeStore = getNodeStore(id) as Writable<ArmConfig>;
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

    background-color: var(--black);
    top: 7px;
    left: 7px;
    height: 6px;
    width: 6px;
  }

  .speed {
    position: absolute;
    left: 50%;
    top: 50%;
    pointer-events: none;

    font-weight: bold;
    transform: translate(-50%, -50%) rotate(0.25turn);
    font-size: 16px;
  }
</style>

<div
  class="option"
  style={`background-color: var(--light${$nodeStore.properties.color}); --length: ${$nodeStore.properties.length}`}
>
  <div class="dot"/>
  <span class="speed" style={`color: var(--${$nodeStore.properties.color});`}>
    {$nodeStore.properties.rate}
  </span>
</div>
