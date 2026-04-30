export interface WeatherCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  /** OWM weather condition code (e.g. 800 = clear). */
  conditionId: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyItem {
  /** Unix timestamp (seconds). */
  time: number;
  temp: number;
  icon: string;
  description: string;
}

export interface DailyItem {
  /** Unix timestamp (seconds) for the calendar day (representative slot). */
  date: number;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyItem[];
  daily: DailyItem[];
}
