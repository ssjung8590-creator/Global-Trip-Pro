export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  icon?: string;
}

export interface WeatherForecast {
  day: string;
  temp: string;
  condition: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  voltage: string;
  plugType: string;
  weatherSummary: string;
  forecast: WeatherForecast[];
  region: 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'Other';
}

export type AppView = 'countries' | 'details' | 'checklist' | 'settings';
