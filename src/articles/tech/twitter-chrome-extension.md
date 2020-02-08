---
title: "Hide the new Twitter sidebar: a simple, locally-hosted Chrome extension"
draft: false
date: "2019-07-25"
subtitle: Quickly remove that distracting side-bar
---
After seeing folks complain about the new Twitter design for days, I finally got included in the rollout. Indeed, the meat of the page seems to be lost. After realizing I could quickly get rid of the right side-bar by simply hiding it, I decided to write a Chrome extension so I wouldn't have to go in and do that again.

![the new Twitter, before changes](https://thepracticaldev.s3.amazonaws.com/i/yxem7tqeodzx2smwax9c.png)

To install this guy, head to [the github repo](https://github.com/AmberWilkie/make-new-twitter-suck-less) and follow the README instructions. If you've never played around with Chrome extensions, this is a great intro - an incredibly simple extension that adjusts the CSS on one page. Extensions are really neat, and there's a world of things you can make with them.

![the new Twitter, after removing the sidebar](https://thepracticaldev.s3.amazonaws.com/i/f7e5eorrlajwnwkzkyrl.png)

The extension will run locally on your machine. If at any time you want to see the side bar again, just turn off the extension (at `chrome://extensions`) or click the little icon for the extension and remove its permissions.

Happy tweeting!