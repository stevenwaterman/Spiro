<script lang="ts">
  import type { PenConfig } from "./config";

  export let config: PenConfig;
</script>

<style>
  .pen {
    height: 8px;
    width: 8px;
    border-radius: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div
  class="pen"
  style={`background-color: ${config.color}`}
/>
