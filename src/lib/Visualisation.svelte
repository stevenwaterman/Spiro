<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import panzoom, { type PanZoom } from "panzoom";
  import SpirographController from "./SpirographController.svelte";
  import Anchor from "./Anchor.svelte";

  let container: HTMLDivElement;

  onMount(() => {
    panzoom(container, {
      minZoom: 0.1,
      maxZoom: 5,
      zoomDoubleClickSpeed: 1,
      smoothScroll: false,
    });
  });

  let show: boolean = false;
</script>

<style>
  .outer {
    position: fixed;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
  }

  .container {
    display: inline-flex;
    position: relative;
  }

  input {
    display: flex;
    top: 0;
    left: 0;
  }
</style>

<input type="checkbox" bind:checked={show}/>

<div class="outer">
  <div class="container" bind:this={container}>
    <SpirographController {show}/>
    <Anchor {show}/>
  </div>
</div>


