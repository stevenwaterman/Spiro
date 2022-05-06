<script lang="ts">
  import SpirographController from "./SpirographController.svelte";
  import Anchor from "./Anchor.svelte";
  import { config, showStore, type ArmConfig } from "./config";

  function getMaxRadius(config: ArmConfig): number {
    const options: number[] = [config.length];

    for (let i = 0; i < config.length; i++) {
      const node = config.nodes[i];
      if (node?.nodeType === "ARM") options.push(i + getMaxRadius(node));
    }

    return Math.max(...options);
  }

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 2;

  let maxRadius: number;
  $: maxRadius = getMaxRadius(config) * 20;

  let scale: number;
  $: scale = 0.9 * maxAllowedRadius / maxRadius;
</script>

<style>
  .center {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: -10;
    transform: translate(-50%, -50%)
  }
  
  .scale {
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;

    transform: scale(var(--scale));
  }

  input {
    display: flex;
    top: 0;
    left: 0;
  }
</style>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

<div class="center">
  <div class="scale" style={`--scale: ${scale}`}>
    <SpirographController/>
    <Anchor/>
  </div>
</div>

<input type="checkbox" bind:checked={$showStore}/>
