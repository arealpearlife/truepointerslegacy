export const ICE_CLIMATE_DELAY_MS = 10_000;
export const ICE_CLIMATE_RAMP_MS = 50_000;
export const ICE_CLIMATE_WARM_C = 16;
export const ICE_CLIMATE_COLD_C = -8;
export const ICE_CLIMATE_SESSION = "legacy-ice-climate-start";

export type IceClimate = {
  started: boolean;
  intensity: number;
  celsius: number;
};

export function climateAt(elapsedMs: number): IceClimate {
  const elapsed = Math.max(0, elapsedMs);
  if (elapsed < ICE_CLIMATE_DELAY_MS) {
    return { started: false, intensity: 0, celsius: ICE_CLIMATE_WARM_C };
  }
  const intensity = Math.min(1, (elapsed - ICE_CLIMATE_DELAY_MS) / ICE_CLIMATE_RAMP_MS);
  const celsius = Math.round(
    ICE_CLIMATE_WARM_C + (ICE_CLIMATE_COLD_C - ICE_CLIMATE_WARM_C) * intensity,
  );
  return { started: true, intensity, celsius };
}

export function formatTrayTemp(celsius: number): string {
  return `${celsius}°C`;
}

export function readClimateStart(
  now: number,
  storage: Pick<Storage, "getItem" | "setItem">,
): number {
  const saved = Number(storage.getItem(ICE_CLIMATE_SESSION));
  if (Number.isFinite(saved) && saved > 0) return saved;
  storage.setItem(ICE_CLIMATE_SESSION, String(now));
  return now;
}
