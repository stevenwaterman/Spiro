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

  .level {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    color: var(--green);
    font-weight: bold;
    font-size: 10vw;
    opacity: 0.8;
  }

  .sub {
    margin-top: 1em;
    font-size: 0.8em;
  }
</style>

<svelte:body on:keydown={keyDown}/>

<div class="container">
  {#if $levelNumberStore <= 15}
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
  {:else}
    <div class="level">
      <span>You Win!</span>
      <span class="sub">Thanks for Playing</span>
    </div>
  {/if}
</div>
