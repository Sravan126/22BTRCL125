export function isValidUrl(url: string): boolean {
  try {
    // Allow http/https only
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseValidityMinutes(input?: string): number | undefined {
  if (!input || input.trim() === "") return undefined;
  const num = Number(input);
  if (!Number.isInteger(num) || num <= 0) return NaN;
  return num;
}


