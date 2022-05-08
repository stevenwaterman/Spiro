<script lang="ts">
import { nodesConfigStore } from "$lib/state";

  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import Arm from "./Arm.svelte";
  import Pen from "./Pen.svelte";

  export let id: string | undefined;
  export let ghost: boolean = false;

  let nodeConfig: NodeConfig | undefined;
  $: nodeConfig = id === undefined ? undefined : $nodesConfigStore[id];

  export let rotation: number | undefined = undefined;
  $: rotation = nodeConfig?.placement?.phase;
</script>

{#if id && nodeConfig?.nodeType === "ARM"}
  <Arm {id} {ghost}/>
{:else if id && nodeConfig?.nodeType === "PEN"}
  <Pen {id} {ghost}/>
{/if}
