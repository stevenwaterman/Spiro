<script lang="ts">
  import SpirographController from "./SpiroLine/SpirographController.svelte";
  import Anchor from "./SpiroArm/Anchor.svelte";
  import { radiusStore } from "$lib/levels";
  import { answerCorrectStore } from "$lib/solution";

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 2;

  let scale: number;
  $: scale = Math.min(10, 0.9 * maxAllowedRadius / $radiusStore);
</script>

<style>
  .container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
  }
  
  .scale {
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
    background-color: black;
    border-radius: 100%;

    transform: translate(-50%, -50%);
  }

  .success {
    background-color: green;
  }
</style>

<div class="container" bind:clientHeight={height} bind:clientWidth={width} class:success={$answerCorrectStore}>
  <div class="center">
    <div class="scale" style={`--scale: ${scale}`}>
      <div class="dot"/>
      <SpirographController/>
      <Anchor/>
    </div>
  </div>
</div>

