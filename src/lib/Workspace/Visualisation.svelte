<script lang="ts">
  // import SpirographController from "./SpiroLine/SpirographController.svelte";
  import Anchor from "./SpiroArm/Anchor.svelte";
  import { levelCompleteStore, levelNameStore, levelNumberStore, radiusStore } from "$lib/levels";
  import type { NodeConfig } from "$lib/types";
  import { nodeLookupStore, selectionStore } from "$lib/state";

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 40;

  let scale: number;
  $: scale = Math.min(10, maxAllowedRadius / $radiusStore);

  let anchors: NodeConfig[];
  $: anchors = Object.values($nodeLookupStore)
    .filter(conf => conf.parent === undefined)
    .filter(conf => conf.id !== "A");
</script>

<style>
  .container {
    display: inline-flex;
    position: relative;
    height: 100%;
    width: 100%;

    flex-grow: 1;
    flex-basis: 0;

    transition: flex-grow 1s;
  }

  .center {
    display: inline-flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
  }
  
  .scale {
    display: inline-flex;
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;

    transform: scale(var(--scale));
  }

  .dot {
    position: absolute;
    left: 50%;
    top: 50%;

    width: 6px;
    height: 6px;
    background-color: var(--white);
    border-radius: 100%;

    transform: translate(-50%, -50%);

    transition-property: opacity;
    transition-duration: 1s;
  }

  .level {
    position: fixed;
    top: 8px;
    right: 8px;
    color: var(--white);
    font-weight: bold;
    font-size: 3vw;
    opacity: 0.5;
    filter: blur(1.5px);
  }

  .row {
    display: flex;
    flex-direction: column;

    height: 100%;
    /* width: var(--radius); */
    width: fit-content;
    overflow-y: scroll;

    align-items: center;
  }
</style>

<div class="level">
  {$levelNumberStore} - {$levelNameStore}
</div>

{#key $levelNumberStore}
  <div class="row" style={`--radius: ${$radiusStore}px;`}>
    {#each anchors as anchor (anchor.id)}
      <Anchor nodeConfig={anchor}/>
    {/each}
  </div>

  <div class="container" bind:clientHeight={height} bind:clientWidth={width}>
    <div class="center">
      <div class="scale" style={`--scale: ${scale}`}>
        <Anchor nodeConfig={$nodeLookupStore["A"]} primary/>
      </div>
    </div>
  </div>
{/key}

