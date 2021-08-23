import {
  getStoredBadgeNumber,
  getStoredOptions,
  getStoredRepositories,
  setStoredBadgeNumber,
  setStoredOptions,
  setStoredRepositories,
} from '../storage';
import { IssueSummary, Repository } from '../../types';
import { getRepositoryTrackingData } from '../api';
import { generateRandomID } from '../misc';

/**
 * Re-fetch and update data fields for a chrome alarm event and save to storage.
 * Also displays a chrom notification for new information.
 * @param  {number}  notificationClearTime The time to display a notification
 *                                         for any new events
 * @return {Promise<void>}  Promise that fetches and saves data
 */
export const updateDataForAlarm = async (notificationClearTime: number) => {
  const repositories = await getStoredRepositories();
  if (!repositories.length) {
    // If there were previously events on the badge,
    // the user has deleted repositories and the
    // badge needs to be reset.
    const badgeNumber = await getStoredBadgeNumber();
    if (badgeNumber) {
      await updateBadge(0);
    }
    return;
  }

  // Load user's options.
  const { apiKey, enableNotifications } = await getStoredOptions();

  // Get new data, notifications, and badge number.
  const { newData, notificationItems, badgeNumber } =
    await fetchBadgeAndNotificationData(repositories, apiKey);

  // Display badge. Badge should display total number of new issues in last
  // 24 hours.
  await updateBadge(badgeNumber);
  // Display new notification info.
  if (enableNotifications && notificationItems.length) {
    const title = generateTitleByType(newData);
    renderNotification(title, notificationItems, notificationClearTime);
  }
};

/**
 * Initialize data in chrome local storage for use on installation
 * @return {Promise<void>}  Promise that saves initial data
 */
export const initializeLocalStorageData = async () => {
  await setStoredOptions({
    apiKey: '',
    enableNotifications: true,
  });
  await setStoredRepositories([]);
  await setStoredBadgeNumber(0);
};

/**
 * Update the stored badge number and set the badge text
 * @param  {number}         badgeNumber Badge number to save and set as text
 * @return {Promise<void>}  Promise that resolves if badge number is saved
 */
const updateBadge = async (badgeNumber: number): Promise<void> => {
  await setStoredBadgeNumber(badgeNumber);
  chrome.action.setBadgeText({
    text: `${badgeNumber}`,
  });
};

interface BadgeNotificationResult {
  newData: IssueSummary[];
  notificationItems: chrome.notifications.ItemOptions[];
  badgeNumber: number;
}

/**
 * Obtain badge and notification data from all repositories
 * @param  {Repository[]} repositories An array of GitHub repository objects
 * @param  {apiKey}     apiKey         String for user GitHub API key
 * @return {Promise}                   Promise that resolves with BadgeNotificationResult
 */
const fetchBadgeAndNotificationData = async (
  repositories: Repository[],
  apiKey: string,
): Promise<BadgeNotificationResult> => {
  // Initialize data and iterate over repositories.
  let newData: IssueSummary[] = [];
  let notificationItems: chrome.notifications.ItemOptions[] = [];
  for (const repository of repositories) {
    // JJF TODO: Better haandle error cases. A few to think of:
    // (1) ran out of GitHub requests, (2) APiKey expired or got cancelled,
    // (4) repository got deleted or was made private, (4) bad internet
    // connection
    if (repository.error) continue;

    // Get relevant data for this repository and set it.
    const { trackingData, etag, status, error } =
      await getRepositoryTrackingData(repository, apiKey);
    repository.etag = etag;
    repository.trackingData = trackingData;
    repository.error = error;

    // Continue if error or no updates on GitHub server (304), or
    // if there's an error.
    if (error || status === 304) {
      if (repository.justAdded) {
        repository.justAdded = false;
      }
      continue;
    }

    // Filter data since last notification, and update repository.
    const { newRepoData, mostRecentDate } =
      extractNewDataForNotification(repository);
    repository.mostRecentDate = mostRecentDate;

    // Do not generate notification information this time
    // if a user just added the repository.
    if (repository.justAdded) {
      repository.justAdded = false;
      continue;
    }
    // Accumulate date for this repository into arrays.
    notificationItems = [
      ...notificationItems,
      ...createChromeListItems(newRepoData, repository.name),
    ];
    newData = [...newData, ...newRepoData];
  }

  // Save data, and count badge events.
  await setStoredRepositories(repositories);
  const badgeNumber = countAllRepositoryEvents(repositories);
  return { newData, notificationItems, badgeNumber };
};

/**
 * Extracts new data and updates a repository's last recorded event.
 * @param  {Repository} repository  A GitHub repository object
 * @return {{IssueSummary[], Date}} Object containing repository tracking data
 *                                  and most recent date event.
 */
const extractNewDataForNotification = (
  repository: Repository,
): {
  newRepoData: IssueSummary[];
  mostRecentDate: string;
} => {
  // JSON dates data from the API are strings and possibly null
  // for some date items, so need to convert to Dates. We can
  // use the Epoch here in place of null/undefined.
  const lastRecordStr = repository.mostRecentDate;
  const lastRecord = lastRecordStr ? new Date(lastRecordStr) : new Date(0);
  let bestSoFar = lastRecord;
  const newRepoData = repository.trackingData.filter((item) => {
    const createdAt = new Date(item.created_at);
    if (createdAt > lastRecord) {
      if (createdAt > bestSoFar) {
        bestSoFar = createdAt;
      }
      return true;
    }
  });

  return { mostRecentDate: bestSoFar.toString(), newRepoData };
};

/**
 * Counts the total number of tracking data items for all repositories
 * @param  {Repository[]} repositories Array of repositories
 * @return {number}                    Total number of tracking data items
 */
const countAllRepositoryEvents = (repositories: Repository[]): number => {
  return repositories.reduce((acc, repo) => {
    acc = acc + repo.trackingData.length;
    return acc;
  }, 0);
};

/**
 * Count IssueSummary events by type
 * @param  {IssueSummary[]} data               Array of IssueSummary elements
 * @return {{nPulls:number, nIssues:number}}   Object containing number of issues and pull requests
 */
const countTrackEvents = (
  data: IssueSummary[],
): { nPulls: number; nIssues: number } => {
  const nPulls = data.filter((item) => item.type === 'pr').length;
  return {
    nPulls,
    nIssues: data.length - nPulls,
  };
};

/**
 * Format a title for a chrome notification
 * @param  {IssueSummary[]} data Array of IssueSummary elements
 * @return {string}              Formatted string for a chrome notification
 */
const generateTitleByType = (data: IssueSummary[]): string => {
  const { nPulls, nIssues } = countTrackEvents(data);
  if (nPulls && nIssues) {
    const pullsEnd: string = nPulls > 1 ? 's' : '';
    const issuesEnd: string = nIssues > 1 ? 's' : '';
    return `${nPulls} new PR${pullsEnd} and ${nIssues} new Issue${issuesEnd}:`;
  }
  if (nPulls) {
    const ending: string = nPulls > 1 ? 's' : '';
    return `${nPulls} new PR${ending}:`;
  }
  if (nIssues) {
    const ending: string = nIssues > 1 ? 's' : '';
    return `${nIssues} new Issue${ending}:`;
  }
  return 'New Events: ';
};

/**
 * Render a notification
 * @param  {string}                              title     Chrome notification title
 * @param  {chrome.notifications.ItemOptions[]}  items     Chrome notiFICATION items
 * @param  {number}                              clearTime Time that notification shows
 * @return {void}
 */
const renderNotification = (
  title: string,
  items: chrome.notifications.ItemOptions[],
  clearTime: number,
): void => {
  const type = 'list';
  const message = 'Recent GitHub Repository Activity';
  const iconUrl = 'icon.png';
  const opt: chrome.notifications.NotificationOptions = {
    type,
    title,
    message,
    items,
    iconUrl,
  };

  const notificationId = generateRandomID(4);
  chrome.notifications.create(notificationId, opt);
  setTimeout(() => {
    chrome.notifications.clear(notificationId);
  }, clearTime);
};

/**
 * Generate a list of items for rendering a chrome notification
 * @param  {IssueSummary[]} data                 Data from GitHub API for a repository
 * @param  {string}         name                 Repository name
 * @return {chrome.notifications.ItemOptions[]}  Array used for rendering chrome notifiation
 */
const createChromeListItems = (
  data: IssueSummary[],
  name: string,
): chrome.notifications.ItemOptions[] => {
  return data.map((obj) => {
    const eventType = obj.type === 'pr' ? 'PR' : 'Issue';
    const title = `➤ ${name} #${obj.number}[${eventType}]`;
    const message = `${obj.title}`;
    return { title, message };
  });
};
