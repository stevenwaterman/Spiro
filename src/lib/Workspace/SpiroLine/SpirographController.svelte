<script lang="ts">
  import { answerStore, levelCompleteStore, levelStore, radiusStore } from "$lib/levels";
  import Spirograph from "./Spirograph.svelte";
  import SpirographAnswer from "./SpirographAnswer.svelte";
  import { penWheelConfigsStore } from "./state";
</script>

<svg
  viewBox={`${-$radiusStore} ${-$radiusStore} ${$radiusStore * 2} ${$radiusStore * 2}`}
  width={$radiusStore * 2}
  height={$radiusStore * 2}
>
  {#if !$levelCompleteStore}
    {#each $answerStore as answer}
      <SpirographAnswer config={answer}/>
    {/each}
  {/if}

  {#each $penWheelConfigsStore as penWheelConfig, idx (penWheelConfig.penId)}
    <Spirograph config={penWheelConfig} {idx} />
  {/each}
</svg>
