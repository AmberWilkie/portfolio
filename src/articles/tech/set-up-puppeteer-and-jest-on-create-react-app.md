---
title: "How not to despair while setting up Puppeteer and Jest on a create-react-app (plus CI on Travis)"
draft: false
date: "2018-08-21"
---
It seems I don’t have an article to write that started out as anything other
than a tale of woe. Here’s today’s tale of woe: setting up my create-react-app
for end-to-end testing.

![street art and urban decay in Romania](https://cdn-images-1.medium.com/max/2600/1*cA8YV3_fM2w79l0e0pvIKg.jpeg)

### Background

We have a number of React clients in our ecosystem, but only one of them faces
the public (other than login screens): an application form. Now we want to make
a few other things public, so we’ll need to either make a bunch of other apps
(nasty) or clean up the application and make it one home for public-facing
content.

But standing in our way is the fact that this application form was written first
by me, as I learned React (*shudder*), then by our newest hire, as *she* learned
React. That is to say, the code is a goddamn nightmare and it’s completely
untested.

So, step one: set up the testing framework so we can throw a thousand tests as
this guy. Step two is going to be refactoring, but that’s a tale of woe for
another day.

### Setup

First things first: dependencies. You’ll need `puppeteer`: `yarn add -dev
puppeteer`. Create-react-app (I’ll just say CRA from now on) comes pre-installed
with jest stuff, so don’t install it, even if the tutorial says so.

Now set up your tests to run as a script in `package.json`, unless they are
already there (mine were). You’re looking for this line:

    "test": "react-scripts test --env=jsdom",

I went all over the interwebs trying to find the right thing to put here. Just
stick to what you already have.

#### Port

We have a bunch of apps, so they all need to run on different ports. My config
sets our port to be 3030, so we have this line in `scripts`:

    "start": "PORT=3030 react-scripts start",

I can’t believe that’s all the setup that was required, but it is.

### Writing that first test

Yeah the standard “just render the app without crashing” test fails for me. I
don’t know why and if you can’t tell, this has been a frustrating process. It’s
good enough for me to get a test running that actually does load the app. Here’s
the code for that. In `App.test.js`:

    import React from 'react';
    import puppeteer from 'puppeteer';
    describe('renders without crashing', () => {
      test(
        'we view the welcome h1 header',
        async () => {
          let browser = await puppeteer.
    ({
            headless: true,
          });
          let page = await browser.newPage();
          await page.goto('http://localhost:3030');
          await page.waitForSelector('.welcome-message');
          const header = await page.$eval('h1', e => e.innerHTML);
          expect(header).toEqual('Awesome that you want to apply!');
          browser.close();
        },
        16000
      );
    });

This is pretty sweet, really. We can use all these `async / await` functions so
that we can wait for the headless browser to locate the spots in the page we
care about. At this point I am only testing that our header has loaded with a
welcome message for our applicants.

(By the way, toggle that `headless` to `false` and the browser will actually
open so you can see your tests running.)

You can also set browser sizing and things, but it’s not necessary. You can
check the [Puppeteer docs right
here](https://github.com/yomete/react-puppeteer).

Now go ahead and `yarn test`. If you’re anything like me, you already had your
local server running and the test passed and you were so happy! Time to start
writing a bajillion tests.

### Setting up CI with Travis

Not so fast, my friends. Turns out that local server is critical for running a
headless browser, something I discovered while watching build after build fail
on Travis with a `net::ERR_CONNECTION_REFUSED at http://localhost` . Here’s my
final `.travis.yml` config:

    language: node_js
    node_js:
      - "9"
    dist: trusty
    sudo: required
    addons:
      chrome: stable
      hostname: localhost
    before_install:
      - google-chrome-stable --headless --disable-gpu --remote-debugging-port=9222 http://localhost &
    before_script:
      - yarn start &
    cache:
      yarn: true
      directories:
        - node_modules
    install:
      - yarn install
    script:
      - yarn test

Two things that were needed that don’t immediately stand out: `sudo: required`
or else you get some other bizarre error. And that `before_script` hook. I swear
to god, I did not see *anyone* on the internet tell me I had to do this. The
only reason I even realized was because I shut off my local server and got the
same error locally. “Wait a minute…” I said. I also learned that `&` on the end
of commands means to run them in the background.

Now my local server was happily humming along in Travis, just waiting for some
tests to come along and make good use of it.

### References

[This
tutorial](https://blog.logrocket.com/end-to-end-testing-react-apps-with-puppeteer-and-jest-ce2f414b4fd7),
which I’m sorry to say is a good start but has become outdated, as this article
no doubt will basically immediately.
