export function stoneLabel(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function lengthLabel(value: string): string {
  return value.replace(/\s*inches$/i, '"');
}
