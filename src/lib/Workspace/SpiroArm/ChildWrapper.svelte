<script lang="ts">
  import { getNodeStore } from "$lib/state";
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import Arm from "./Arm.svelte";
  import Pen from "./Pen.svelte";

  export let id: string | undefined;
  export let ghost: boolean = false;

  let nodeStore: Writable<NodeConfig> | undefined;
  $: nodeStore = id === undefined ? undefined : getNodeStore(id);

  export let rotation: number | undefined = undefined;
  $: rotation = $nodeStore?.placement?.phase;
</script>

{#if id && $nodeStore?.nodeType === "ARM"}
  <Arm {id} {ghost}/>
{:else if id && $nodeStore?.nodeType === "PEN"}
  <Pen {id} {ghost}/>
{/if}
