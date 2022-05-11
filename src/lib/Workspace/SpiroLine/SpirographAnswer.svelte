<script lang="ts">
  import type { WheelConfig } from "./types";
  import { fade } from "svelte/transition";
  import { radiusStore } from "$lib/levels";

  export let config: WheelConfig[];

  let lengthEstimate: number;
  $: lengthEstimate = config.map(wheel => wheel.length * Math.abs(wheel.rate)).reduce((a,b) => a+b, 0);

  let pointCount: number;
  $: pointCount = Math.round(lengthEstimate * 200 / $radiusStore);

  let points: string;
  $: points = getPoints(config);

  function getPoints(wheels: WheelConfig[]): string {
    let points: string = "";
    for (let i = 0; i < pointCount; i++) {
      const t = Math.PI * 2 * i / pointCount
      points += getPoint(wheels, t)
    }
    return points;
  }

  function getPoint(wheels: WheelConfig[], t: number): string {
    let x = 0;
    let y = 0;

    wheels.forEach(wheel => {
      const phase = (wheel.phase / 12) * 2 * Math.PI + t * wheel.rate;
      x += Math.cos(phase) * wheel.length;
      y += Math.sin(phase) * wheel.length;
    });

    return `${x * 20},${y * 20} `;
  }
</script>

<style>
  polygon {
    stroke-width: 2;
    stroke-linejoin: round;
    stroke: var(--white);

    fill: transparent;
    opacity: 0.2;
  }
</style>

<polygon {points} transition:fade/>
