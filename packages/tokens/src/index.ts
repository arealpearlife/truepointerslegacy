export const colors = {
  popeCherry: "#B51232",
  bloodDiamond: "#8E1029",
  crystalWhite: "#FFFFFF",
  diamondFrost: "#F5FAFF",
  platinumSilver: "#C8D1DC",
  glacierBlue: "#BDEBFF",
  clearCrystal: "#E8F6FC",
} as const;

export const signal = {
  cherry: "#E5002B",
  ice: "#00B4FF",
  iceGlow: "#6FD8FF",
  deepBlood: "#4A0414",
  ink: "#14060A",
} as const;

export const cssVariables = `:root {
  --color-pope-cherry: ${colors.popeCherry};
  --color-blood-diamond: ${colors.bloodDiamond};
  --color-crystal-white: ${colors.crystalWhite};
  --color-diamond-frost: ${colors.diamondFrost};
  --color-platinum-silver: ${colors.platinumSilver};
  --color-glacier-blue: ${colors.glacierBlue};
  --color-clear-crystal: ${colors.clearCrystal};
  --color-cherry-signal: ${signal.cherry};
  --color-ice-signal: ${signal.ice};
  --color-ice-glow: ${signal.iceGlow};
  --color-deep-blood: ${signal.deepBlood};
  --color-ink: ${signal.ink};
}`;
