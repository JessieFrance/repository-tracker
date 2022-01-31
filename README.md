# <img src="src/static/icon.png" width="45" align="left"> Repository Tracker

[![Actions Status](https://github.com/JessieFrance/repository-tracker/workflows/Build%20and%20Test/badge.svg)](https://github.com/JessieFrance/repository-tracker/actions)
[![GitHub license](https://img.shields.io/github/license/JessieFrance/repository-tracker?style=flat-square)](https://github.com/JessieFrance/repository-tracker/blob/main/LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pidkkdkplogkjahekhddnikenfplmocg?style=flat-square)](https://chrome.google.com/webstore/detail/repository-tracker/pidkkdkplogkjahekhddnikenfplmocg)

> A free, Chrome extension that lets you track issues and pull requests in your favorite GitHub repositories.

![video](https://user-images.githubusercontent.com/64499366/151725384-8f219da2-144f-4aaf-aea3-feafb4dd92af.gif)

## Introduction

Repository Tracker lets you add your favorite GitHub repositories, and then tracks pull requests and issues that occurred in the last day. You can optionally receive popup notifications to let you know when someone files a new issue or pull request in one of the repositories you track. 

## Installation

If you would like to try this extension, please download it for free from the Chrome store [here](https://chrome.google.com/webstore/detail/repository-tracker/pidkkdkplogkjahekhddnikenfplmocg). 

GitHub limits the number of API requests this extension can make to its API. Additionally, you may wish to track your team's private repositories. For these reasons, we recommend getting your own GitHub API key with repository level access following these [steps from GitHub](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).

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
