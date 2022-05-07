<script lang="ts">
  import Controls from "$lib/Controls/Controls.svelte";
  import Visualisation from "$lib/Workspace/Visualisation.svelte";
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;

    background-color: var(--grey);
  }
</style>

<div class="row">
  <Controls/>
  <Visualisation/>
</div>
