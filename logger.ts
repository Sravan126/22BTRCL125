// Simple logging service without using console
// Stores logs in-memory and in localStorage for inspection

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: string; // ISO
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const STORAGE_KEY = "app_logs";

function loadStoredLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as LogEntry[];
    return [];
  } catch {
    return [];
  }
}

function persistLogs(logs: LogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-1000)));
  } catch {
    // ignore persistence errors
  }
}

let inMemoryLogs: LogEntry[] = loadStoredLogs();

function createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
}

export const Logger = {
  log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry = createEntry(level, message, context);
    inMemoryLogs.push(entry);
    persistLogs(inMemoryLogs);
  },
  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  },
  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  },
  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    this.log("error", message, context);
  },
  getAll(): LogEntry[] {
    return [...inMemoryLogs];
  },
  clear() {
    inMemoryLogs = [];
    persistLogs(inMemoryLogs);
  },
};

// Optional fetch wrapper to log network interactions
export async function loggedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const startedAt = Date.now();
  Logger.info("fetch:start", { url: String(input), method: init?.method || "GET" });
  try {
    const res = await fetch(input, init);
    Logger.info("fetch:complete", {
      url: String(input),
      ok: res.ok,
      status: res.status,
      durationMs: Date.now() - startedAt,
    });
    return res;
  } catch (e) {
    Logger.error("fetch:error", { url: String(input), error: String(e), durationMs: Date.now() - startedAt });
    throw e;
  }
}


