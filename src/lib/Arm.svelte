<script lang="ts">
  import type { ArmConfig } from "./config";

  import Node from "./Node.svelte";
  export let config: ArmConfig;
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
    animation-duration: 30s;
  }

  :global(.show) .arm {
    animation-name: rotate;
  }

  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(calc(1turn * var(--rate)));
    }
  }

  
</style>

<div
  class="arm"
  style={`--rate: ${config.rate}; background-color: ${config.color}`}
>
  {#each config as _, i}
    <Node config={config.nodes[i]}/>
  {/each}
</div>
