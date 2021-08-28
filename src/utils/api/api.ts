import {
  ApiData,
  IssueSummary,
  Repository,
  RepositoryTrackingData,
} from '../../types';
import { filterLastDay } from './timeFilters';

// GitHub constants
const BASE_URL = 'https://api.github.com';
const PER_PAGE = 100; // results per page. 100 is maximum.

interface ApiFetchResult {
  data: ApiData[];
  etag: string;
  status: number;
  error: string | null;
}

/**
 * Fetch data from GitHub for tracking repository issues
 * @param  {Repository}     repository The repository to fetch data for
 * @param  {string}         apiKey     Optional api key
 * @return {ApiFetchResult}            Promise that resolves with results
 *                                     from GitHub api fetch
 */
const fetchApiData = async (
  repository: Repository,
  apiKey?: string,
): Promise<ApiFetchResult> => {
  const { owner, name } = repository;
  const url = `${BASE_URL}/repos/${owner}/${name}/issues?state=all&per_page=${PER_PAGE}`;

  const requestHeaders = new Headers();
  if (apiKey && apiKey !== '') {
    requestHeaders.set('Authorization', `token ${apiKey}`);
  }

  const { etag: currentEtag } = repository;
  if (currentEtag && currentEtag !== '') {
    requestHeaders.set('If-None-Match', currentEtag);
  }

  const result = await fetch(url, {
    headers: requestHeaders,
  });
  const { status } = result;

  // Status 304 means no updates from GitHub API server.
  if (status === 304) {
    return { data: [], etag: currentEtag, status, error: null };
  }

  // Error handling
  if (!result.ok) {
    let error: string | null = null;
    if (status === 401) {
      error = 'Invalid API key';
    }
    if (status === 404) {
      error = 'Invalid repository name';
    }
    error = error ?? 'Unable to access data';
    return { data: [], etag: repository.etag, status, error };
  }

  // Data should be valid now, so filter and return it.
  const etag = result.headers.get('etag');
  let data: ApiData[] = await result.json();
  data = filterLastDay(data) as ApiData[];
  return { data, etag, status, error: null };
};

/**
 * Extracts most relevant information from ApiData into IssueSummary
 * @param  {ApiData[]} data Array containing API data from GitHub
 * @return {IssueSummary[]} Array with selected API data
 */
const extractTrackingData = (data: ApiData[]): IssueSummary[] => {
  return data.map((apiItem) => {
    return {
      number: apiItem.number,
      title: apiItem.title,
      author: apiItem.user.login,
      created_at: apiItem.created_at,
      type: apiItem.pull_request ? 'pr' : 'issue',
    };
  });
};

/**
 * Obtain relevant/filtered tracking data for a single repository.
 * This function fetches raw GitHub API data, and extracts only the
 * most relevant information for a repository.
 * @param  {Repository} repository A GitHub repository object
 * @param  {string}     apiKey     String for user GitHub API key
 * @return {Promise}               Promise that resolves with RepositoryTrackingData
 */
export const getRepositoryTrackingData = async (
  repository: Repository,
  apiKey: string,
): Promise<RepositoryTrackingData> => {
  const { data, etag, status, error } = await fetchApiData(repository, apiKey);

  // If status 304, there are no new updates on GitHub since
  // last fetch, but we still need to make sure data is up to date.
  if (status === 304) {
    let { trackingData } = repository;
    trackingData = filterLastDay(trackingData) as IssueSummary[];
    return { trackingData, etag, status, error: null };
  }

  const trackingData = extractTrackingData(data);
  return { trackingData, etag, status, error };
};

interface ErrorMessage {
  message: string;
}
/**
 * Check if an API key is valid
 * @param  {string} apiKey A GitHub API key to test
 * @return {Promise} Promise that resolves with a string containing an error
 *                   message for an invalid key, or null if the key is valid
 */
export const checkAPIkey = async (apiKey: string): Promise<string | null> => {
  const result: Response = await fetch(BASE_URL, {
    headers: {
      Authorization: `token ${apiKey}`,
    },
  });
  if (result.ok) return null;
  const errMsg = ((await result.json()) as ErrorMessage).message;
  return errMsg;
};
