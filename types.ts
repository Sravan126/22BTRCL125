export interface ShortUrl {
  id: string; // uuid
  code: string; // shortcode
  longUrl: string;
  createdAt: string; // ISO
  expiresAt: string; // ISO
  custom?: boolean;
}

export interface ClickEvent {
  id: string; // uuid
  code: string; // shortcode
  timestamp: string; // ISO
  source: string; // e.g., "shortener", "stats", "direct"
  location?: string; // coarse city/country
}

export interface StoredData {
  urls: ShortUrl[];
  clicks: ClickEvent[];
}


