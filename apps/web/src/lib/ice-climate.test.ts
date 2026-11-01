import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CLIMATE_INK_ICE,
  CLIMATE_PRICE_ICE,
  CLIMATE_SOFT_ICE,
  ICE_CLIMATE_COLD_C,
  ICE_CLIMATE_DELAY_MS,
  ICE_CLIMATE_RAMP_MS,
  ICE_CLIMATE_SESSION,
  ICE_CLIMATE_WARM_C,
  climateAt,
  climateHue,
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

  it("turns type from cherry to readable ice as the shop freezes", () => {
    expect(climateHue(0)).toEqual({
      hot: 1,
      cold: 0,
      priceIce: CLIMATE_PRICE_ICE,
      inkIce: CLIMATE_INK_ICE,
      softIce: CLIMATE_SOFT_ICE,
    });
    expect(climateHue(0.5).hot).toBeCloseTo(0.5);
    expect(climateHue(1)).toEqual({
      hot: 0,
      cold: 1,
      priceIce: "#0077b3",
      inkIce: "#0a3a52",
      softIce: "#006890",
    });
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css).toContain("--climate-price");
    expect(css).toContain(CLIMATE_PRICE_ICE);
    expect(css).toContain("color: var(--climate-price)");
    expect(css).toContain("color: var(--climate-ink)");
    expect(css).toContain("color: var(--climate-accent)");
  });
});
