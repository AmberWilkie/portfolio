---
title: "How not to get fired while refactoring legacy code"
subtitle: "Ten lessons learned from a big project and many failures"
draft: true
date: "2020-08-01"
---
This title is tongue-and-cheek, but it's also true. I have managed not to get fired (yet) 
while refactoring a big and very important piece of our legacy codebase.
Here are ten important lessons I've learned along the way, and hopefully something you can bring to your own refactors. But first...

![Public sculpture in Ghent](../../assets/images/article-images/spring-2019-27.jpg)

# Why refactor?
Before you start any refactor project, you will inevitably get pushback: why refactor this code?
There are two types of people who will ask you this - those who think the code is fine as-is (because it "works")
and those who want to rewrite it from scratch because it's so bad as to be unsalvageable. You may often agree
with the second camp, but because commerce halts for no man, will be forced into the middle road by the first camp,
if they give you the leeway at all.

The main reason for a refactor is that the code has become unworkable. New features may be desired, but they are so hard to implement
that development becomes disastrously slow. If your refactor is happening on a very old codebase,
it may be necessary because the technology is no longer supported, or it's very hard to find developers to work with it.

Either way, you know the code needs a big lift and you're in charge. Here's my best takeaways from refactoring the checkout process at my company.

# Takeaway #1: If someone asks you to refactor untested mission-critical pathways, refuse.
I wish I had. When I started this refactor project, our web app was completely untested.
Sure, there were a handful of Cypress tests that literally went through and placed real orders in a test location.
But those didn't run in a pipeline. Nobody really knew when they did run. Just sometimes the QA guy would pipe up:
"uh, did somebody change something?" We were constantly breaking checkout.

No unit tests, no integration tests, and really sparse end-to-end tests that were routinely breaking themselves.
At least once a week, we'd have a all-hands-on-deck situation where users couldn't check out, or couldn't use coupons, 
or any of a dozen other problems.

If I could do it all over again, I'd insist on getting things integration tested before I jumped in and started moving stuff around.
