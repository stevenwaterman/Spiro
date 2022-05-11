<script lang="ts">
  import Anchor from "./SpiroArm/Anchor.svelte";
  import { levelNameStore, levelNumberStore, radiusStore } from "$lib/levels";
  import { isPrimaryPos, isSecondaryPos, type NodeConfigPositioned } from "$lib/types";
  import { nodeLookupStore, selectionStore } from "$lib/state";

  let width: number;
  let height: number;
  let maxAllowedRadius: number;
  $: maxAllowedRadius = Math.min(width, height) / 40;

  let scale: number;
  $: scale = Math.min(10, maxAllowedRadius / $radiusStore);

  let secondaries: NodeConfigPositioned<"SECONDARY">[];
  $: secondaries = Object.values($nodeLookupStore)
    .filter(isSecondaryPos);

  let primary: NodeConfigPositioned<"PRIMARY">;
  $: primary = Object.values($nodeLookupStore).find(isPrimaryPos) as NodeConfigPositioned<"PRIMARY">;

  function mouseMove(event: MouseEvent) {
    const selection = $selectionStore;
    if (selection === undefined) return;

    const left = 100 * event.clientX / width;
    const top = 100 * event.clientY / height;

    nodeLookupStore.update(nodes => {
      const selected = nodes[selection];
      if (!isSecondaryPos(selected)) return nodes;
      
      selected.parent.left = left;
      selected.parent.top = top;
      
      return nodes;
    })
  }

  function click(event: MouseEvent) {
    selectionStore.set(undefined);
  }
</script>

<style>
  .container {
    display: inline-flex;
    position: relative;
    height: 100%;
    width: 100%;

    flex-grow: 1;
    flex-basis: 0;

    transition: flex-grow 1s;
  }
  
  .scale {
    display: inline-flex;
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;

    transform: scale(var(--scale));
  }

  .level {
    position: fixed;
    top: 8px;
    right: 8px;
    color: var(--white);
    font-weight: bold;
    font-size: 3vw;
    opacity: 0.5;
    filter: blur(1.5px);
  }
</style>

<div class="level">
  {$levelNumberStore} - {$levelNameStore}
</div>

{#key $levelNumberStore}
  <div class="container" bind:clientHeight={height} bind:clientWidth={width} on:mousemove={mouseMove} on:click|self={click}>
    <!-- <div class="scale" style={`--scale: ${scale}`}> -->
      <Anchor nodeConfig={primary}/>

      {#each secondaries as anchor (anchor.id)}
        <Anchor nodeConfig={anchor}/>
      {/each}
    <!-- </div> -->
  </div>
{/key}

