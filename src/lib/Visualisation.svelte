<script lang="ts">
  import SpirographController from "./SpirographController.svelte";
  import Anchor from "./Anchor.svelte";
  import { showStore } from "./config";
</script>

<style>
  .outer {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: -10;

    transform: translate(-50%, -50%) scale(1);
  }

  input {
    display: flex;
    top: 0;
    left: 0;
  }
</style>

<div class="outer">
  <SpirographController/>
  <Anchor/>
</div>

<input type="checkbox" bind:checked={$showStore}/>
