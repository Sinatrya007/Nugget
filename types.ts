
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface ShareSession {
  id: string;
  title: string;
  creatorName: string;
  createdAt: number;
  expiresAt: number;
  receivedLocations: LocationData[];
}

export enum AppRoute {
  HOME = 'home',
  DASHBOARD = 'dashboard',
  SHARE = 'share',
  RESULT = 'result'
}
