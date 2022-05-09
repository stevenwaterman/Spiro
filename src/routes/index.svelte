<script lang="ts">
  import Visualisation from "$lib/Workspace/Visualisation.svelte";
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
  <Visualisation/>
</div>
