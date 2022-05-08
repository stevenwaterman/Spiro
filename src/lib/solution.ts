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

// export function fromStringToWheelConfig(config: string): WheelConfig[] {
//   const wheels = config.split(" ").filter(s => s.length > 0).map(arm => {
//     const [lengthStr, rateAndPhaseStr] = arm.split("x");
//     const length = Number.parseFloat(lengthStr);

//     const [rateStr, phaseStr] = rateAndPhaseStr.split("+");
//     const rate = Number.parseFloat(rateStr);
//     const phase = Number.parseFloat(phaseStr) * 2 * Math.PI;

//     return { length, rate, phase };
//   });
//   return normaliseWheels(wheels);
// }

function fromWheelConfigToString(config: WheelConfig[]): string {
  return config
    .map(wheel => `${wheel.length}x${wheel.rate}+${wheel.phase / (2 * Math.PI)}`)
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

  const normalisedPhase = normalisedRates.map(config => ({ ...config, phase: config.phase % 1 }));
  const normalString = fromWheelConfigToString(normalisedPhase);

  const invertRate = normalisedPhase.map(config => ({ ...config, rate: -config.rate }));
  invertRate.sort((a, b) => a.rate - b.rate);
  const invertString = fromWheelConfigToString(invertRate);

  return invertString > normalString ? invertRate : normalisedPhase;
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

  const aAngle = a.phase * 2 * Math.PI;
  const aDeltaX = Math.cos(aAngle) * a.length;
  const aDeltaY = Math.sin(aAngle) * a.length;

  const bAngle = b.phase * 2 * Math.PI;
  const bDeltaX = Math.cos(bAngle) * b.length;
  const bDeltaY = Math.sin(bAngle) * b.length;

  const deltaX = aDeltaX + bDeltaX;
  const deltaY = aDeltaY + bDeltaY;
  const length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  const angle = Math.acos(deltaX / length);
  const phase = angle / (2 * Math.PI);
  return { length, phase, rate };
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
