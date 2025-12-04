export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  lat: number;
  lon: number;
  country: string;
  region: string;
  tags: string[];
  confidenceScore: number;
  category: 'security' | 'diplomacy' | 'economy' | 'conflict' | 'humanitarian' | 'technology';
}

export interface FilterState {
  dateRange: { from: Date | null; to: Date | null };
  regions: string[];
  countries: string[];
  tags: string[];
  sources: string[];
  searchQuery: string;
  categories: string[];
}

export type ViewMode = 'map' | 'list' | 'timeline';
