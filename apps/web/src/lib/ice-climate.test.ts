import { describe, expect, it } from "vitest";
import {
  ICE_CLIMATE_COLD_C,
  ICE_CLIMATE_DELAY_MS,
  ICE_CLIMATE_RAMP_MS,
  ICE_CLIMATE_SESSION,
  ICE_CLIMATE_WARM_C,
  climateAt,
  formatTrayTemp,
  readClimateStart,
} from "./ice-climate";

describe("Ice climate", () => {
  it("stays a cool room for the first ten seconds", () => {
    expect(climateAt(0)).toEqual({ started: false, intensity: 0, celsius: ICE_CLIMATE_WARM_C });
    expect(climateAt(ICE_CLIMATE_DELAY_MS - 1).started).toBe(false);
    expect(climateAt(ICE_CLIMATE_DELAY_MS - 1).celsius).toBe(16);
  });

  it("starts frosting after ten seconds and drops below freezing at full cold", () => {
    expect(climateAt(ICE_CLIMATE_DELAY_MS)).toEqual({
      started: true,
      intensity: 0,
      celsius: ICE_CLIMATE_WARM_C,
    });
    const mid = climateAt(ICE_CLIMATE_DELAY_MS + ICE_CLIMATE_RAMP_MS / 2);
    expect(mid.started).toBe(true);
    expect(mid.intensity).toBeCloseTo(0.5);
    expect(mid.celsius).toBe(4);
    expect(mid.celsius).toBeGreaterThan(ICE_CLIMATE_COLD_C);
    const frozen = climateAt(ICE_CLIMATE_DELAY_MS + ICE_CLIMATE_RAMP_MS);
    expect(frozen.intensity).toBe(1);
    expect(frozen.celsius).toBe(ICE_CLIMATE_COLD_C);
    expect(frozen.celsius).toBeLessThan(0);
    expect(climateAt(ICE_CLIMATE_DELAY_MS + ICE_CLIMATE_RAMP_MS * 3).celsius).toBe(-8);
  });

  it("keeps one session start so closing the shop clears the cold", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(readClimateStart(1000, storage)).toBe(1000);
    expect(readClimateStart(5000, storage)).toBe(1000);
    expect(store.get(ICE_CLIMATE_SESSION)).toBe("1000");
    expect(formatTrayTemp(-8)).toBe("-8°C");
  });
});
