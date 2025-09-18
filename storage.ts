import { Logger } from "../logging/logger";
import { ClickEvent, ShortUrl, StoredData } from "./types";

const STORAGE_KEY = "url_shortener_data_v1";

function load(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { urls: [], clicks: [] };
    const parsed = JSON.parse(raw) as StoredData;
    if (!parsed.urls) parsed.urls = [];
    if (!parsed.clicks) parsed.clicks = [];
    return parsed;
  } catch (e) {
    Logger.error("storage:load:error", { error: String(e) });
    return { urls: [], clicks: [] };
  }
}

function save(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    Logger.error("storage:save:error", { error: String(e) });
  }
}

export function getAllUrls(): ShortUrl[] {
  return load().urls;
}

export function getUrlByCode(code: string): ShortUrl | undefined {
  return load().urls.find(u => u.code === code);
}

export function isCodeTaken(code: string): boolean {
  return !!getUrlByCode(code);
}

export function addUrls(urls: ShortUrl[]): void {
  const data = load();
  data.urls.push(...urls);
  save(data);
}

export function addClick(click: ClickEvent): void {
  const data = load();
  data.clicks.push(click);
  save(data);
}

export function getClicksByCode(code: string): ClickEvent[] {
  return load().clicks.filter(c => c.code === code);
}

export function pruneExpired(): void {
  const data = load();
  const now = Date.now();
  const activeCodes = new Set<string>();
  data.urls = data.urls.filter(u => {
    const exp = Date.parse(u.expiresAt);
    const active = isNaN(exp) || exp > now;
    if (active) activeCodes.add(u.code);
    return true; // keep history; expiry handled on redirect
  });
  data.clicks = data.clicks.filter(c => activeCodes.has(c.code));
  save(data);
}


