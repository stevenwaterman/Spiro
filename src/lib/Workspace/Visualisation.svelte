<script lang="ts">
  import Anchor from "./SpiroArm/Anchor.svelte";
  import { levelNameStore, levelNumberStore, radiusStore } from "$lib/levels";
  import { isPrimaryPos, isSecondaryPos, type NodeConfigPositioned } from "$lib/types";
  import { nodeLookupStore, selectionStore, updateSecondaryLocation } from "$lib/state";

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 40;

  let scale: number;
  $: scale = Math.min(5, maxAllowedRadius / ($radiusStore * 1.1));

  let secondaries: NodeConfigPositioned<"SECONDARY">[];
  $: secondaries = Object.values($nodeLookupStore)
    .filter(isSecondaryPos);

  let primary: NodeConfigPositioned<"PRIMARY">;
  $: primary = Object.values($nodeLookupStore).find(isPrimaryPos) as NodeConfigPositioned<"PRIMARY">;

  function mouseMove(event: MouseEvent) {
    updateSecondaryLocation($selectionStore, event);
  }

  function click(event: MouseEvent) {
    selectionStore.set(undefined);
  }
</script>

<style>
  .container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .level {
    position: fixed;
    top: 8px;
    right: 8px;
    color: var(--white);
    font-weight: bold;
    font-size: 3vw;
    opacity: 0.4;
  }
</style>

<div class="level">
  {$levelNumberStore} - {$levelNameStore}
</div>

{#key $levelNumberStore}
  <div
    class="container"
    bind:clientHeight={height}
    bind:clientWidth={width}
    on:mousemove={mouseMove}
    on:click={click}
    style={`--scale: ${scale}`}
  >
    {#each secondaries as anchor (anchor.id)}
      <Anchor nodeConfig={anchor}/>
    {/each}

    <Anchor nodeConfig={primary}/>
  </div>
{/key}

