<script lang="ts">
  import { isArm, isPen, type NodeConfig } from "$lib/types";
  import Arm from "./Arm.svelte";
  import Pen from "./Pen.svelte";

  export let nodeConfig: NodeConfig | undefined;
  export let anchorId: string;
</script>

{#if isArm(nodeConfig)}
  <Arm {nodeConfig} {anchorId}/>
{:else if isPen(nodeConfig)}
  <Pen {nodeConfig} {anchorId}/>
{/if}
