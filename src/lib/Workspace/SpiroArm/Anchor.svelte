<script lang="ts">
  import { anchorIdStore, duration, selectionStore } from "../../state";
  import ChildWrapper from "./ChildWrapper.svelte";
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

<div class="anchor" style={`--duration: ${duration};`}>
  <ChildWrapper idx={0} id={$anchorIdStore}/>
</div>
