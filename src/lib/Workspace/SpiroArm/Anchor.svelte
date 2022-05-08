<script lang="ts">
  import type { NodeConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import { anchorIdStore, duration, getNodeStore } from "../../state";
  import ChildWrapper from "./ChildWrapper.svelte";
  import {levelCompleteStore} from "$lib/levels";

  let anchorId: string | undefined;
  $: anchorId = $anchorIdStore;

  let anchorStore: Writable<NodeConfig> | undefined;
  $: anchorStore = anchorId === undefined ? undefined : getNodeStore(anchorId);

  let anchorConfig: NodeConfig | undefined;
  $: anchorConfig = anchorStore === undefined ? undefined : $anchorStore;

  let rotation: number;
  $: rotation = anchorConfig?.placement?.phase ?? 0;
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

<div class="anchor" class:hide={$levelCompleteStore} style={`--duration: ${duration}; transform: rotate(${rotation ?? 0}turn);`}>
  <ChildWrapper id={$anchorIdStore}/>
</div>
