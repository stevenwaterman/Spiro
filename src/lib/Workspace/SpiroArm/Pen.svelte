<script lang="ts">
  import { anchorIdStore, nodeStores } from "$lib/state";
  import type { PenConfig, Placement } from "$lib/types";

  import type { Writable } from "svelte/store";
  
  export let id: string;
  export let idx: number;
  export let ghost: boolean;

  let nodeStore: Writable<PenConfig>;
  $: nodeStore = nodeStores[id] as Writable<PenConfig>;

  function rightClick() {
    const parentId: string | undefined = $nodeStore.placement?.parent;
    if (parentId === undefined) {
      anchorIdStore.set(undefined);
    } else {
      nodeStores[parentId].update(conf => {
        const placement = conf.placement as Placement;
        delete placement.children[idx];
        return conf;
      })
    }
    
    nodeStore.update(conf => ({
      ...conf,
      placement: undefined
    }));
  }
</script>

<style>
  .pen {
    height: 8px;
    width: 8px;
    border-radius: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .ghost {
    opacity: 0.5;
  }
</style>

<div
  class="pen"
  class:ghost
  style={`background-color: ${$nodeStore.properties.color}`}
  on:contextmenu|preventDefault|stopPropagation={rightClick}
/>
