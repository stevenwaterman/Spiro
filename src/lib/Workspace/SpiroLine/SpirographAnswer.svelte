<script lang="ts">
  import type { WheelConfig } from "./types";
  import { fade } from "svelte/transition";

  export let config: WheelConfig[];

  let points: string;
  $: points = getPoints(config);

  function getPoints(wheels: WheelConfig[]): string {
    let points: string = "";
    const pointCount = 10000;
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
      const phase = wheel.phase + t * wheel.rate;
      x += Math.cos(phase) * wheel.length;
      y += Math.sin(phase) * wheel.length;
    });

    return `${x * 20},${y * 20} `;
  }
</script>

<style>
  polygon {
    stroke-width: 2;
    fill: transparent;
    opacity: 0.2;
    stroke: black;
  }
</style>

<polygon {points} transition:fade/>
