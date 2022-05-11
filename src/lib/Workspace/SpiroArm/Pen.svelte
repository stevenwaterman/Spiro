<script lang="ts">
  import { fraction, removePiece, selectionStore, showStore, updateSecondaryLocation } from "$lib/state";
  import type { PenConfig } from "$lib/types";
  import { faPen } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { penWheelConfigsStore } from "../SpiroLine/state";
  import type { WheelConfig } from "../SpiroLine/types";
  
  export let nodeConfig: PenConfig;

  function leftClick(event: MouseEvent) {
    removePiece(nodeConfig.id);
    updateSecondaryLocation(nodeConfig.id, event);
    selectionStore.set(nodeConfig.id);
  }

  let wheelConfig: WheelConfig[];
  $: wheelConfig = Object.values($penWheelConfigsStore).flat().find(conf => conf.penId === nodeConfig.id)?.wheels ?? [];

  let penRate: number;
  $: penRate = wheelConfig.length > 0 ? -wheelConfig[wheelConfig.length - 1].rate : 0;

  let rotations: number;
  $: rotations = penRate * fraction;

  let pen: HTMLDivElement | undefined;

  let resetting: boolean = false;

  $: if (pen !== undefined && !$showStore) {
    const transform = getComputedStyle(pen).transform;
    const [a,b] = transform
      .substring(7, transform.length - 1)
      .split(",")
      .map(s => Number.parseFloat(s));
    const shortcutRotations = Math.atan2(b, a) * (180/Math.PI) / 360;
    pen.style.setProperty("--shortcutRotations", shortcutRotations + "turn");
    resetting = true;
    setTimeout(() => {
      resetting = false;
    })
  }
</script>

<style>
  .pen {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    width: 10px;
    height: 10px;
    margin: 5px;

    border-radius: 100%;
    position: absolute;

    transform-origin: 50% 50%;

    transform: rotate(0);

    transition-property: transform;
    transition-duration: 500ms;
    transition-timing-function: linear;
  }

  .pen:not(.ghost) {
    cursor: pointer;
  }

  .show.pen {
    transform: rotate(calc(1turn * var(--rotations)));
    transition-duration: calc(1s * var(--duration));
  }

  .resetting.pen {
    transition: none;
    transform: rotate(var(--shortcutRotations));
  }
</style>

<div
  bind:this={pen}
  class="pen"
  class:show={$showStore}
  class:resetting
  style={`
    color: var(--light${nodeConfig.color});
    background-color: var(--${nodeConfig.color});
    --rotations: ${rotations};
  `}
  on:click|stopPropagation={leftClick}
>
  <Fa icon={faPen} size="2x" translateX="0.5" translateY="-0.5"/>
</div>
