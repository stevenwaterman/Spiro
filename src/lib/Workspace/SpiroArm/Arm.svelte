<script lang="ts">
  import { isParentPos, type ArmConfig, type NodeConfigPositioned } from "$lib/types";
  import { fraction, nodeLookupStore, removePiece, selectionStore, showStore, updateSecondaryLocation } from "../../state";
  import Node from "./Node.svelte";

  export let nodeConfig: ArmConfig;
  export let anchorId: string;
  export let parentPhase: number;

  let children: Record<number, NodeConfigPositioned<"PARENT">>;
  $: children = Object.values($nodeLookupStore)
    .filter(isParentPos)
    .filter(node => node.parent.id === nodeConfig.id)
    .reduce((acc, elem) => {
      acc[elem.parent.idx] = elem;
      return acc;
    }, {} as Record<number, NodeConfigPositioned<"PARENT">>);

  let arm: HTMLDivElement | undefined;

  let rotations: number;
  $: rotations = nodeConfig.rate * fraction;

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

  function leftClick(event: MouseEvent) {
    if (nodeConfig.id === "A") return;

    removePiece(nodeConfig.id);
    updateSecondaryLocation(nodeConfig.id, event)
    selectionStore.set(nodeConfig.id);
  }

  let maxIdx: number;
  $: maxIdx = nodeConfig.length - 1;
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

  .speed {
    position: absolute;
    left: 50%;
    top: 50%;
    pointer-events: none;

    font-weight: bold;
    transform: translate(-50%, -50%);
    font-size: 16px;

    user-select: none;
  }
</style>

<div
  class="arm"
  bind:this={arm}
  class:show={$showStore}
  class:resetting

  style={`
    --rotations: ${rotations};
    background-color: var(--light${nodeConfig.color});
  `}

  on:click|stopPropagation={leftClick}
>
  {#each {length: nodeConfig.length} as _, i}
    <Node parentConfig={nodeConfig} childConfig={children[maxIdx - i]} idx={maxIdx - i} {anchorId} {parentPhase} />
  {/each}

  {#if nodeConfig.rate !== 0}
    <span
      class="speed"
      style={`color: var(--${nodeConfig.color});`}
    >
      {nodeConfig.rate}
    </span>
  {/if}
</div>
