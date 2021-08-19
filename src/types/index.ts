export interface IssueSummary {
  number: number;
  title: string;
  author: string;
  created_at: string; // This is a string when fetched from api
  type: 'pr' | 'issue';
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  error?: string | null;
  etag: string;
  mostRecentDate?: string | null;
  trackingData?: IssueSummary[];
  justAdded: boolean;
}

export interface PullRequest {
  url: string;
  html_url: string;
}

export interface ApiData {
  number: number;
  title: string;
  user: { login: string };
  body: string;
  created_at: string; // This is a string when fetched from api
  pull_request?: PullRequest;
}

export interface LocalStorageOptions {
  apiKey: string;
  enableNotifications: boolean;
}

export interface LocalStorage {
  repositories?: Repository[];
  options?: LocalStorageOptions;
  badgeNumber?: number;
}

export type LocalStorageKeys = keyof LocalStorage;

export interface RepositoryTrackingData {
  trackingData: IssueSummary[];
  etag: string;
  status: number;
  error: null | string;
}
