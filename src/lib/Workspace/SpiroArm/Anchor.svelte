<script lang="ts">
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import { anchorIdStore, durationStore, nodesConfigStore } from "../../state";
  import ChildWrapper from "./ChildWrapper.svelte";
  import {levelCompleteStore} from "$lib/levels";

  let anchorId: string | undefined;
  $: anchorId = $anchorIdStore;

  let anchorConfig: NodeConfig | undefined;
  $: anchorConfig = anchorId === undefined ? undefined : $nodesConfigStore[anchorId];

  let rotation: number;
  $: rotation = (anchorConfig?.placement?.phase ?? 0) / 12;
</script>

<style>
  .anchor {
    position: absolute;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
    width: 0;
    height: 0;
    transform-origin: 10px 10px;

    transition-property: opacity;
    transition-duration: 1s;
  }

  .hide {
    opacity: 0;
  }
</style>

<div class="anchor" class:hide={$levelCompleteStore} style={`--duration: ${$durationStore}; transform: rotate(${rotation}turn);`}>
  <ChildWrapper id={$anchorIdStore}/>
</div>
