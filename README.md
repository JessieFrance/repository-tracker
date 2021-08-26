# <img src="src/static/icon.png" width="45" align="left"> Repository Tracker

> A free, Chrome extension that lets you track issues and pull requests in your favorite GitHub repositories.

## Introduction

Repository Tracker lets you add your favorite GitHub repositories, and then tracks pull requests and issues that occurred in the last day. You can optionally receive popup notifications to let you know when someone files a new issue or pull request in one of the repositories you track. 

## Installation

If you would like to try this extension, please download it for free from the Chrome store here. 

GitHub limits the number of API requests this extension can make to its API, and for that reason, we recommend getting your own GitHub API key following these steps here.

After generating your own API key, you can open Repository Tracker, click the Options icon to go to the Options Page, paste the API key, and save other preferences.

## Building

If you would prefer to build this chrome extension from source instead of downloading it from the chrome store, then please follow these steps:

1. Clone this repository.
2. Run `npm install`
3. After installation, use `npm run build`. This should produce a `dist` folder.
4. In your Chrome browser, navigate to `chrome://extensions/`.
5. Click on the "Load unpacked" button, which is usually on the top left side of the screen.
6. Select the `dist` folder. 

## Feedback and Suggestions

Please feel free to file an issue with your feedback.
