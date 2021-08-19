import {
  LocalStorage,
  LocalStorageKeys,
  LocalStorageOptions,
  Repository,
} from '../../types';

type SaveData = LocalStorage | LocalStorageOptions;

/**
 * Save data to local storage
 * @param  {SaveData}  data Data to save to local storage
 * @return {Promise}             Promise (void) that saves to local storage
 */
const saveLocalStorage = (data: SaveData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(data, () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Set the badge number from local storage
 * @param  {number}  badgeNumber The badge number to save
 * @return {Promise}             Promise (void) that saves to local storage
 */
export const setStoredBadgeNumber = (badgeNumber: number): Promise<void> => {
  // Prevent storing anything other than LocalStorage types...
  const data: LocalStorage = {
    badgeNumber,
  };
  return saveLocalStorage(data);
};

/**
 * Get the stored badge number from local storage
 * @return {Promise}   Promise that returns badge number
 */
export const getStoredBadgeNumber = (): Promise<number> => {
  const keys: LocalStorageKeys[] = ['badgeNumber'];
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, (res: LocalStorage) => {
        resolve(res.badgeNumber);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Save repositories in local storage
 * @param  {Repository[]}  repositories Array of repositories
 * @return {Promise} Promise (void) that repositories were saved
 */
export const setStoredRepositories = (
  repositories: Repository[],
): Promise<void> => {
  // Prevent storing anything other than LocalStorage types...
  const data: LocalStorage = {
    repositories,
  };
  return saveLocalStorage(data);
};

/**
 * Get repositories array from local storage
 * @return {Promise}   Promise that returns array of repositories
 */
export const getStoredRepositories = (): Promise<Repository[]> => {
  const keys: LocalStorageKeys[] = ['repositories'];
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, (res: LocalStorage) => {
        resolve(res.repositories);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Save options in local storage
 * @param  {LocalStorageOptions}  options Options object to save
 * @return {Promise} Promise (void) that options were saved
 */
export const setStoredOptions = (
  options: LocalStorageOptions,
): Promise<void> => {
  // Prevent storing anything other than LocalStorage types...
  const data: LocalStorage = {
    options,
  };
  return saveLocalStorage(data);
};

/**
 * Get options from local storage
 * @return {Promise}   Promise that returns LocalStorageOptions object
 */
export const getStoredOptions = (): Promise<LocalStorageOptions> => {
  const keys: LocalStorageKeys[] = ['options'];
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, (res: LocalStorage) => {
        resolve(res.options);
      });
    } catch (error) {
      reject(error);
    }
  });
};
