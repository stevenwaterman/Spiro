<script lang="ts">
  import { levelCompleteStore, levelNumberStore } from "$lib/levels";
  import { selectionStore, showStore } from "$lib/state";
  import Visualisation from "$lib/Workspace/Visualisation.svelte";
  import { fade } from "svelte/transition";
  import Fa from "svelte-fa";
  import { faPause, faPlay, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

  function nextLevel() {
    levelNumberStore.update(level => level + 1);
  }

  function keyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      if ($levelCompleteStore) nextLevel();
      else playPause();
    }
  }

  function playPause() {
    if ($selectionStore !== undefined) return;
    showStore.update(showStore => !showStore);
  }
</script>

<style>
  .container {
    width: 100vw;
    height: 100vh;

    background-color: var(--black);
  }

  button {
    position: fixed;
    bottom: 24px;
    right: 36px;
    /* transform: translateX(-50%); */

    background: none;

    color: var(--green);
    outline: 0;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 60pt;
    cursor: pointer;

    filter: blur(0.5px)
  }
</style>

<svelte:body on:keydown={keyDown}/>

<div class="container">
  <Visualisation/>
  {#if $levelCompleteStore}
    <button transition:fade on:click={nextLevel} on:keydown|preventDefault>
      <Fa icon={faArrowCircleRight} />
    </button>
  {:else}
    <button transition:fade on:click={playPause} on:keydown|preventDefault>
      {#if $showStore}
        <Fa icon={faPause} />
      {:else}
        <Fa icon={faPlay} />
      {/if}
    </button>
  {/if}
</div>
