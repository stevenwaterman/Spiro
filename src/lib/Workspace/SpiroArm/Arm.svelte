<script lang="ts">
  import type { ArmConfig, Placement } from "$lib/types";
  import type { Writable } from "svelte/store";
  import { anchorIdStore, duration, fraction, nodeStores, showStore } from "../../state";
  import Node from "./Node.svelte";

  export let id: string;
  export let idx: number;
  export let ghost: boolean;

  let nodeStore: Writable<ArmConfig>;
  $: nodeStore = nodeStores[id] as Writable<ArmConfig>;

  let arm: HTMLDivElement | undefined;

  let rotations: number;
  $: rotations = $nodeStore.properties.rate * fraction;

  let resetting: boolean = false;

  $: if (arm !== undefined && !$showStore) {
    const transform = getComputedStyle(arm).transform;
    const [a,b] = transform
      .substring(7, transform.length - 1)
      .split(",")
      .map(s => Number.parseFloat(s));
    const shortcutRotations = Math.atan2(b, a) * (180/Math.PI) / 360;
    arm.style.setProperty("--shortcutRotations", shortcutRotations + "turn");
    resetting = true;
    setTimeout(() => {
      resetting = false;
    })
  }

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

    transform: rotate(0);

    transition-property: transform;
    transition-duration: 500ms;
    transition-timing-function: linear;
  }

  .show.arm {
    transform: rotate(calc(1turn * var(--rotations)));
    transition-duration: calc(1s * var(--duration));
  }

  .resetting.arm {
    transition: none;
    transform: rotate(var(--shortcutRotations));
  }

  .ghost {
    opacity: 0.5;
  }
</style>

<div
  class="arm"
  bind:this={arm}
  class:show={$showStore}
  class:resetting
  class:ghost

  style={`
    --rotations: ${rotations};
    --duration: ${duration};
    background-color: ${$nodeStore.properties.color};
  `}

  on:contextmenu|preventDefault|stopPropagation={rightClick}
>
  {#each {length: $nodeStore.properties.length} as _, i}
    <Node childId={$nodeStore?.placement?.children?.[i]} idx={i} parentStore={nodeStore}/>
  {/each}
</div>
