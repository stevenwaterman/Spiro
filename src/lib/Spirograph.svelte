<script lang="ts">
  import type { PenWheelConfig } from "./config";
  import { linear } from "svelte/easing";

  export let config: PenWheelConfig;
  export let show: boolean;

  let points: string;
  $: points = getPoints(config);

  function getPoints(config: PenWheelConfig): string {
    let points: string = "";
    const pointCount = 10000;
    for (let i = 0; i < pointCount; i++) {
      const t = Math.PI * 2 * i / pointCount
      points += getPoint(config, t)
    }
    return points;
  }

  function getPoint(config: PenWheelConfig, t: number): string {
    let x = 0;
    let y = 0;

    let phase = 0;
    config.wheels.forEach(wheel => {
      phase += wheel.phase;
      phase += t * wheel.rate;
      x += Math.cos(phase) * wheel.length;
      y += Math.sin(phase) * wheel.length;
    });

    return `${x * 20},${y * 20} `;
  }

  function draw(node: SVGPolygonElement, _) {
    const duration = 30_000;
    const totalLength = node.getTotalLength();

    const points = node.points;
    const pointLengths: number[] = [];

    let lastPoint: DOMPoint | null = null;
    for (let i = 0; i < points.length; i++) {
      const point = points.getItem(i);

      if (lastPoint === null){
        pointLengths.push(0);

      } else {
        const length = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + 
          Math.pow(point.y - lastPoint.y, 2)
        );
        const lastLength = pointLengths[pointLengths.length - 1];
        pointLengths.push(lastLength + length);
      }

      lastPoint = point;
    }
    pointLengths.push(totalLength);

    function getStyleAt(t: number): string {
      const point = Math.round(t * pointLengths.length);
      const lengthAtPoint = pointLengths[point];
      return `stroke-dasharray: ${lengthAtPoint} ${totalLength - lengthAtPoint}`
    }

    return {
        delay: 0,
        duration,
        easing: linear,
        css: getStyleAt
    };
  }
</script>

<style>
  polygon {
    stroke-width: 2;
    fill: transparent;
    opacity: 0.2;
  }
</style>

{#if show}
  <polygon
    {points}
    stroke={config.color}
    in:draw="{{}}"
  />
{/if}
