<script lang="ts">
  import { answerCorrectStore, durationStore, levelCompleteStore } from "$lib/levels";
  import { linear } from "svelte/easing";
  import { fraction, showStore } from "../../state";
  import type { PenWheelConfig } from "./types";

  export let idx: number;
  export let config: PenWheelConfig;

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

    config.wheels.forEach(wheel => {
      const phase = (wheel.phase / 12) * 2 * Math.PI + t * wheel.rate;
      x += Math.cos(phase) * wheel.length;
      y += Math.sin(phase) * wheel.length;
    });

    return `${x * 20},${y * 20} `;
  }

  function getPointLengths(node: SVGPolygonElement): number[] {
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

    const length = Math.sqrt(
      Math.pow(points[0].x - points[points.length - 1].x, 2) + 
      Math.pow(points[0].y - points[points.length - 1].y, 2)
    );
    const lastLength = pointLengths[pointLengths.length - 1];
    pointLengths.push(lastLength + length);
    
    return pointLengths;
  }

  function draw(polygon: SVGPolygonElement, {}: {}) {
    const pointLengths = polygon === undefined ? [] : getPointLengths(polygon);
    const fractionLength = pointLengths[Math.round((pointLengths.length - 1) * fraction)];
    const totalLength = pointLengths[pointLengths.length - 1];

    polygon.setAttribute("stroke-dasharray", `${totalLength} ${totalLength}`);
    polygon.setAttribute("stroke-dashoffset", `${totalLength - fractionLength}`);

    function getStyleAt(t: number): string {
      const point = Math.round(t * fraction * (pointLengths.length - 1));
      const lengthAtPoint = pointLengths[point];
      return `stroke-dashoffset: ${totalLength - lengthAtPoint}`
    }

    return {
        delay: 0,
        duration: $durationStore * 1000,
        easing: linear,
        css: getStyleAt
    };
  }

  function animationDone() {
    if (idx === 0 && $answerCorrectStore) {
      levelCompleteStore.set(true);
    }
  }
</script>

<style>
  polygon {
    stroke-width: 4;
    fill: transparent;
    opacity: 0.5;

    transition-property: filter, opacity;
    transition-duration: 1s;
  }

  .levelComplete {
    opacity: 1;
  }

  polygon:not(.levelComplete) {
    filter: none !important;
  }
</style>

{#if $showStore}
  <polygon
    {points}
    style={`stroke: var(--${config.color}); filter: drop-shadow(0px 0px 10px var(--light${config.color}));`}
    class:levelComplete={$levelCompleteStore}
    in:draw="{{}}"
    on:introend={animationDone}
  />
{/if}
