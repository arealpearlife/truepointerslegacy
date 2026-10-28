import { describe, expect, it } from "vitest";
import { colors, cssVariables, signal } from "../src/index";

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light! + 0.05) / (dark! + 0.05);
}

describe("approved True Pointers palette", () => {
  it("preserves the approved color values", () => {
    expect(colors).toEqual({
      popeCherry: "#B51232",
      bloodDiamond: "#8E1029",
      crystalWhite: "#FFFFFF",
      diamondFrost: "#F5FAFF",
      platinumSilver: "#C8D1DC",
      glacierBlue: "#BDEBFF",
      clearCrystal: "#E8F6FC",
    });
  });

  it("keeps the saturated signal colors readable where text sits on them", () => {
    expect(contrast(colors.crystalWhite, signal.cherry)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(signal.ink, signal.ice)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.crystalWhite, signal.deepBlood)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(signal.ink, colors.diamondFrost)).toBeGreaterThanOrEqual(4.5);
  });

  it("exposes every token as a CSS variable", () => {
    expect(cssVariables).toContain("--color-cherry-signal: #E5002B");
    expect(cssVariables).toContain("--color-ice-signal: #00B4FF");
    expect(cssVariables).toContain("--color-pope-cherry: #B51232");
  });
});
