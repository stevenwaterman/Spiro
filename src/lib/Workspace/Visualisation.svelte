<script lang="ts">
  import SpirographController from "./SpiroLine/SpirographController.svelte";
  import Anchor from "./SpiroArm/Anchor.svelte";
  import type { ArmConfig } from "$lib/types";
  import { allNodeStores } from "$lib/state";

  let armConfigs: ArmConfig[];
  $: armConfigs = $allNodeStores.filter(config => config.nodeType === "ARM") as ArmConfig[];

  let maxRadius: number;
  $: maxRadius = Math.max(...armConfigs.map(config => config.properties.length + (config.placement?.path ?? []).reduce((a,b) => a+b, 0))) * 20;

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 2;

  let scale: number;
  $: scale = Math.min(10, 0.9 * maxAllowedRadius / maxRadius);
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
</style>

<div class="container" bind:clientHeight={height} bind:clientWidth={width}>
  <div class="center">
    <div class="scale" style={`--scale: ${scale}`}>
      <SpirographController/>
      <Anchor/>
    </div>
  </div>
</div>

