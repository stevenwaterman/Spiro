<script lang="ts">
  import Controls from "$lib/Controls/Controls.svelte";
  import { loadLevel } from "$lib/levels";
  import Visualisation from "$lib/Workspace/Visualisation.svelte";

  loadLevel(7);
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;

    background-color: var(--black);
  }
</style>

<!-- <svelte:body on:contextmenu|preventDefault/> -->

<div class="row">
  <Controls/>
  <Visualisation/>
</div>
