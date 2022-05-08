<script lang="ts">
  import SpirographController from "./SpiroLine/SpirographController.svelte";
  import Anchor from "./SpiroArm/Anchor.svelte";
  import { levelCompleteStore, levelStore, radiusStore } from "$lib/levels";

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 2;

  let scale: number;
  $: scale = Math.min(10, 0.9 * maxAllowedRadius / $radiusStore);
</script>

<style>
  .container {
    display: inline-flex;
    position: relative;
    height: 100%;
    width: 100%;
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

  .hide {
    opacity: 0;
  }
</style>

{#key $levelStore}
  <div class="container" bind:clientHeight={height} bind:clientWidth={width}>
    <div class="center">
      <div class="scale" style={`--scale: ${scale}`}>
        <div class="dot" class:hide={$levelCompleteStore}/>
        <SpirographController/>
        <Anchor/>
      </div>
    </div>
  </div>
{/key}

