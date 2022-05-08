<script lang="ts">
  import { nodesConfigStore } from "$lib/state";
  import type { PenConfig } from "$lib/types";
  
  export let id: string;

  let penConfig: PenConfig;
  $: penConfig = $nodesConfigStore[id] as PenConfig;
</script>

<style>
  .option {
    height: 12px;
    width: 12px;
    border-radius: 100%;
  }
</style>

<div
  class="option"
  style={`background-color: var(--${penConfig.properties.color})`}
/>
