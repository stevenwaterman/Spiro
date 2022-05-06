<script lang="ts">
  import Node from "./Node.svelte";
  import {config} from "./config";

  export let show: boolean;
</script>

<style>
  .anchor {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;

    margin-top: -10px;
    margin-left: -10px;
  }
</style>

<div class="anchor" class:show>
  <Node {config}/>
</div>