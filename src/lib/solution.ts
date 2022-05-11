import { debug } from "svelte/internal";
import type { WheelConfig } from "./Workspace/SpiroLine/types";

export function answersMatch(as: WheelConfig[][], bs: WheelConfig[][]): boolean {
  return as.every(a => bs.some(b => pensMatch(a, b))) &&
    bs.every(b => as.some(a => pensMatch(a, b)));
}

export function pensMatch(a: WheelConfig[], b: WheelConfig[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!wheelsMatch(a[i], b[i])) return false;
  }
  return true;
}

export function wheelsMatch(a: WheelConfig, b: WheelConfig): boolean {
  const lengthMatches = Math.abs(a.length - b.length) < 0.0001;
  const rateMatches = Math.abs(a.rate - b.rate) < 0.0001;
  const phaseMatches = Math.abs(a.phase - b.phase) < 0.0001;
  return lengthMatches && rateMatches && phaseMatches;
}

export function fromStringToWheelConfig(config: string): WheelConfig[] {
  const wheels = config.split(" ").filter(s => s.length > 0).map(arm => {
    const [lengthStr, rateAndPhaseStr] = arm.split("x");
    const length = Number.parseFloat(lengthStr);

    const [rateStr, phaseStr] = rateAndPhaseStr.split("+");
    const rate = Number.parseFloat(rateStr);
    const phase = Number.parseFloat(phaseStr);

    return { length, rate, phase };
  });
  return normaliseWheels(wheels);
}

export function fromWheelConfigToString(config: WheelConfig[]): string {
  return config
    .map(wheel => `${wheel.length}x${wheel.rate}+${wheel.phase}`)
    .join(" ");
}

export function normaliseWheels(wheels: WheelConfig[]): WheelConfig[] {
  const sorted = [...wheels];
  sorted.sort((a, b) => a.rate - b.rate);

  const combinedRates: WheelConfig[] = sorted.reduce(
    (acc: WheelConfig[][], elem: WheelConfig) => {
      if (acc.length === 0) return [[elem]];

      const currentList = acc[acc.length - 1];
      if (currentList[0].rate !== elem.rate) {
        acc.push([elem]);
        return acc;
      } else {
        currentList.push(elem);
        return acc;
      }
    }, []).map(configs => combineMultipleSameRate(configs));

  const rateList = combinedRates.map(config => Math.abs(config.rate)).filter(rate => rate !== 0);
  const rateGCD = rateList.reduce(gcd, 1);
  const normalisedRates = combinedRates.map(config => ({ ...config, rate: config.rate / rateGCD }));

  const normalisedPhase = normalisePhase(normalisedRates);
  const normalString = fromWheelConfigToString(normalisedPhase);

  const invertRate = normalisedPhase.map(config => ({...config, rate: -config.rate}));
  invertRate.sort((a, b) => a.rate - b.rate);
  const invertNormalised = normalisePhase(invertRate);
  const invertString = fromWheelConfigToString(invertNormalised);

  return invertString > normalString ? invertNormalised : normalisedPhase;
}

function combineMultipleSameRate(configs: WheelConfig[]): WheelConfig {
  let config: WheelConfig = configs[0];
  for (let i = 1; i < configs.length; i++) {
    config = combineSameRate(config, configs[i]);
  }
  return config;
}

function combineSameRate(a: WheelConfig, b: WheelConfig): WheelConfig {
  const rate = a.rate;

  const aAngle = a.phase * 2 * Math.PI / 12;
  const aDeltaX = Math.cos(aAngle) * a.length;
  const aDeltaY = Math.sin(aAngle) * a.length;

  const bAngle = b.phase * 2 * Math.PI / 12;
  const bDeltaX = Math.cos(bAngle) * b.length;
  const bDeltaY = Math.sin(bAngle) * b.length;

  const deltaX = aDeltaX + bDeltaX;
  const deltaY = aDeltaY + bDeltaY;
  const length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  const angle1 = Math.acos(deltaX / length) / (2 * Math.PI);
  const angle2 = 1 - angle1;
  const angle = deltaY > 0 ? angle1 : angle2;

  const phase = 12 * angle;

  const output = { length, phase, rate };
  return output;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) { var temp = a; a = b; b = temp; }
  while (true) {
    if (b == 0) return a;
    a %= b;
    if (a == 0) return b;
    b %= a;
  }
}

function normalisePhase(normalisedRates: WheelConfig[]): WheelConfig[] {
  const phaseGTZero: WheelConfig[] = normalisedRates.map(wheel => {
    const phase = ((wheel.phase % 12) + 12) % 12;
    return {...wheel, phase: phase};
  })

  const phaseOptions: WheelConfig[][] = [];
  const phaseTotals: number[] = [];

  for(let i = 0; i < 12; i++) {
    const option = phaseGTZero.map(wheel => {
      const oldPhase = wheel.phase;
      const phaseChange = wheel.rate * i;
      const newPhase = oldPhase + phaseChange;
      const moduloPhase = ((newPhase % 12) + 12) % 12;
      return {...wheel, phase: moduloPhase};
    });
    const phaseTotal = option.map(wheel => wheel.phase).reduce((a,b) => a+b, 0);
    
    phaseOptions.push(option);
    phaseTotals.push(phaseTotal);
  }

  const minPhaseTotal: number = Math.min(...phaseTotals);
  const idx = phaseTotals.indexOf(minPhaseTotal);
  return phaseOptions[idx];
}