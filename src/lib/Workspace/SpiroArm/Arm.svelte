<script lang="ts">
  import type { ArmConfig } from "$lib/types";
  import type { Writable } from "svelte/store";
  import { duration, fraction, getNodeStore, removePiece, selectionStore, showStore } from "../../state";
  import Node from "./Node.svelte";

  export let id: string;
  export let ghost: boolean;

  let nodeStore: Writable<ArmConfig>;
  $: nodeStore = getNodeStore(id) as Writable<ArmConfig>;

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
    removePiece(id);
  }

  function leftClick() {
    removePiece(id);
    selectionStore.set(id);
  }

  let length: number;
  $: length = $nodeStore.properties.length;

  let maxIdx: number;
  $: maxIdx = length - 1;
</script>

<style>
  .arm {
    display: flex;
    flex-direction: row-reverse;

    position: absolute;
    left: 0;
    top: 0;

    box-sizing: content-box;
    border-radius: 20px;

    transform-origin: 10px 10px;

    transform: rotate(0);

    transition-property: transform;
    transition-duration: 500ms;
    transition-timing-function: linear;
  }

  .arm:not(.ghost) {
    cursor: pointer;
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
    pointer-events: none;
  }

  .speed {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
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
    background-color: var(--${$nodeStore.properties.color});
  `}

  on:contextmenu|preventDefault|stopPropagation={rightClick}
  on:click|stopPropagation={leftClick}
>
  {#each {length} as _, i}
    <Node childId={$nodeStore?.placement?.children?.[maxIdx - i]} idx={maxIdx - i} parentStore={nodeStore} />
  {/each}

  <span class="speed">{$nodeStore.properties.rate}</span>
</div>
