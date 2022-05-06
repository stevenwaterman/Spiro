<script lang="ts">
  import Arm from "./Arm.svelte";
  import Pen from "./Pen.svelte";

  import type { NodeConfig } from "./config";

  export let config: NodeConfig | undefined;
</script>

<style>
  .node {
    position: relative;

    height: 20px;
    width: 20px;
  }

  .dot {
    position: absolute;
    top: 8px;
    left: 8px;
    height: 4px;
    width: 4px;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
</style>

<div
  class="node"
  style={`transform: rotate(${config?.["phase"] ?? 0}turn);`}
>
  <div class="dot"/>

  {#if config?.nodeType === "ARM"}
    <Arm config={config}/>
  {:else if config?.nodeType === "PEN"}
    <Pen config={config}/>
  {/if}
</div>