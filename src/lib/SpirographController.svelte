<script lang="ts">
  import { config, type ArmConfig, type PenWheelConfig } from "./config";
  import Spirograph from "./Spirograph.svelte";

  function getPenWheelConfigs(config: ArmConfig): PenWheelConfig[] {
    const outputs: PenWheelConfig[] = [];
    for (let i = 0; i < config.length; i++) {
      const child = config.nodes[i];
      if (child === undefined) continue;

      const thisWheel = {
        length: i,
        phase: config.phase * 2 * Math.PI,
        rate: config.rate
      };
      
      if (child.nodeType === "PEN") {
        outputs.push({
          wheels: [thisWheel],
          color: child.color
        })
      } else {
        const recursiveCall = getPenWheelConfigs(child);
        recursiveCall.forEach(output => output.wheels.unshift(thisWheel));
        outputs.push(...recursiveCall);
      }
    }

    return outputs;
  }

  let penWheelConfigs: PenWheelConfig[];
  $: penWheelConfigs = getPenWheelConfigs(config);

  let maxRadius: number;
  $: maxRadius = Math.max(
    ...penWheelConfigs.map(
        penConfig => penConfig.wheels.map(
          wheel => wheel.length
        ).reduce((a,b) => a+b, 0))) * 20 + 10;
</script>

<svg
  viewBox={`${-maxRadius} ${-maxRadius} ${maxRadius*2} ${maxRadius*2}`}
  width={maxRadius * 2}
  height={maxRadius * 2}
>
  {#each penWheelConfigs as penWheelConfig}
    <Spirograph config={penWheelConfig}/>
  {/each}
</svg>