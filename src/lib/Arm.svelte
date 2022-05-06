<script lang="ts">
  import { duration, fraction, showStore, type ArmConfig } from "./config";

  import Node from "./Node.svelte";
  export let config: ArmConfig;

  let arm: HTMLDivElement | undefined;

  let rotations: number;
  $: rotations = config.rate * fraction;

  let resetting: boolean = false;

  $: if (arm !== undefined && !$showStore) {
    const transform = getComputedStyle(arm).transform;
    const [a,b] = transform
      .substring(7, transform.length - 1)
      .split(",")
      .map(s => Number.parseFloat(s));
    const shortcutRotations = Math.atan2(b, a) * (180/Math.PI) / 360;
    arm.style.setProperty("--shortcutRotations", shortcutRotations + "turn");
    resetting = true;
    setTimeout(() => {
      resetting = false;
    })
  }
</script>

<style>
  .arm {
    display: flex;
    flex-direction: row;

    position: absolute;
    left: 0;
    top: 0;

    box-sizing: content-box;
    border-radius: 20px;

    transform-origin: 10px 10px;

    animation-direction: normal;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-iteration-count: 1;

    transform: rotate(0);

    transition-property: transform;
    transition-duration: 500ms;
    transition-timing-function: linear;
  }

  .show.arm {
    transform: rotate(calc(1turn * var(--rotations)));
    transition-duration: calc(1s * var(--duration));
  }

  .resetting.arm {
    transition: none;
    transform: rotate(var(--shortcutRotations));
  }
</style>

<div
  class="arm"
  bind:this={arm}
  class:show={$showStore}
  class:resetting

  style={`
    --rotations: ${rotations};
    --duration: ${duration};
    background-color: ${config.color};
  `}
>
  {#each config as _, i}
    <Node config={config.nodes[i]}/>
  {/each}
</div>
