export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

export interface Entry {
  id: number;
  visibility: Visibility;
  date: string;
  comment: string;
  weather: Weather;
}

export type NewEntry = Omit<Entry, "id">;
