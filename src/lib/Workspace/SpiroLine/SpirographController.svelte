<script lang="ts">
  import { radiusStore } from "$lib/levels";
  import { answerStore } from "$lib/solution";
  import Spirograph from "./Spirograph.svelte";
  import SpirographAnswer from "./SpirographAnswer.svelte";
  import { penWheelConfigsStore } from "./state";
</script>

<svg
  viewBox={`${-$radiusStore} ${-$radiusStore} ${$radiusStore * 2} ${$radiusStore * 2}`}
  width={$radiusStore * 2}
  height={$radiusStore * 2}
>
  {#each $answerStore as answer}
    <SpirographAnswer config={answer}/>
  {/each}

  {#each $penWheelConfigsStore as penWheelConfig (penWheelConfig.penId)}
    <Spirograph config={penWheelConfig} />
  {/each}
</svg>
