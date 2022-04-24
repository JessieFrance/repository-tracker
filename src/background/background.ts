import {
  handleMessages,
  initializeLocalStorageData,
  updateDataForAlarm,
} from './background-utils';

// Key constants
const NOTIFICATION_INTERVAL_TIME = 1; // minutes
const NOTIFICATION_CLEAR_TIME = 10000; // milliseconds

/**
 * This runs when the app first gets installed. It initializes local storage
 * data and sets up chrome alarms for routine tasks like updating data.
 */
chrome.runtime.onInstalled.addListener(async () => {
  await initializeLocalStorageData();
  chrome.alarms.create({
    periodInMinutes: NOTIFICATION_INTERVAL_TIME,
  });
  // Get the message, ignore the sender, and get the callback function
  // to acknowledge message receipt.
  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    handleMessages(message);
    sendResponse();
  });
});

/**
 * This runs on each chrome alarm interval. It re-fetches data, saves to
 * storage, and displays notification data.
 */
chrome.alarms.onAlarm.addListener(async () => {
  await updateDataForAlarm(NOTIFICATION_CLEAR_TIME);
});
