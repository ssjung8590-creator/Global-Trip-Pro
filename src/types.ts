export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  icon?: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  voltage: string;
  plugType: string;
  weatherSummary: string;
}

export type AppView = 'countries' | 'details' | 'checklist';
