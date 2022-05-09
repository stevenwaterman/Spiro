<script lang="ts">
  import type { NodeConfig } from "$lib/types";
  import Arm from "./Arm.svelte";
  import Pen from "./Pen.svelte";

  export let nodeConfig: NodeConfig;
  export let anchorId: string;
  export let ghost: boolean = false;
</script>

{#if nodeConfig.type === "ARM"}
  <Arm {nodeConfig} {anchorId} {ghost}/>
{:else}
  <Pen {nodeConfig} {anchorId} {ghost}/>
{/if}
