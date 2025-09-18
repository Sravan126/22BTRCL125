const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateShortCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * ALPHABET.length);
    code += ALPHABET[idx];
  }
  return code;
}

export function isValidCustomCode(code: string): boolean {
  if (!code) return false;
  if (code.length < 3 || code.length > 20) return false;
  return /^[a-zA-Z0-9_-]+$/.test(code);
}


