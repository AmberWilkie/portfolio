---
title: "Uploading source maps to Sentry with Gulp: solved!"
draft: false
date: "2019-04-18"
---

I'm learning that the first thing any new developer on the job wants to do is upend all the tooling. I was crazy-frustrated when we onboarded a dude at my old company who wanted to do this. Now that I've started a new job, I'm the one complaining about tooling (and feeling humble).

So here I was, trying to get into the code base at this tiny startup. I'd gotten my login for [Sentry](https://www.sentry.io/), the error tracking service, and was rearing to pick some bugs and start fixing. Unfortunately, this is what I saw:

![Useless minified reference to error in the code](https://cdn-images-1.medium.com/max/1600/1*WLSMMS6qKvlkSKA1wX5l4w.png)

A reference to minified code. This sent me down what seems like an unnecessarily complicated rabbit-hole of sourcemappery. May you, dear reader, avoid this suffering with the tips to follow.

### What is a sourcemap?

A sourcemap is a guide to translate a minified version of Javascript code to the human-readable code we work with. Because we write massive amounts of Javascript and send it willy-nilly to browsers all over the place, we minify it to eke out those easily-tossable bytes. We end up with code like in the screenshot above.

Typically, we will bundle up the Javascript in our files, dump it all into one file, then minify it for shipping to the browser. A function like this:
```javascript
const myFunction = (paramOne, paramTwo, paramThree) => {
  console.log(paramOne);
  return paramTwo + paramThree
}
```

gets minified to this:
```javascript
const myFunction=(o,n,c)=>(console.log(o),n+c);
```

Great for browsers, not so great for anyone who needs to figure out what the heck `myFunction` is doing.

### Don't upload source maps to production (I guess)

The easier it is to figure out how your code is doing what it's doing, the easier it will be for bad guys to find a way to exercise their badiness. Source maps are essentially a guide to your code, so [it can be a security risk](https://security.stackexchange.com/questions/113480/should-javascript-and-css-map-source-maps-be-included-on-production-servers) to upload them to production. That said, the internets seem to be of two minds on this. If you feel comfortable sending them to the world, I guarantee you that's an easier way to get your proper stack trace on Sentry.

Sentry allows you to directly upload source maps, bypassing any security issues with having them online. But they are very particular about how you upload those files and nothing less than exactly right will produce code you actually want to see in their error log.

### Starting point

When I walked into this project, we were already generating source maps with [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps), and sending them to sentry using [gulp-sentry-release](https://www.npmjs.com/package/gulp-sentry-release), an npm package that hasn't been updated in three years (!). Here's a super-pared-down version of our gulp scripts task:
```javascript
gulp.src('./scripts/**/*.js')
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.concat('./scripts.js'))
  .pipe(plugins.uglify)
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest('./dist'))
```

and Sentry deploy:
```javascript
const  sentryRelease = plugins.sentryRelease({
  API_URL: 'https://app.getsentry.com/api/0/projects/our-team',
  API_KEY: process.env.SENTRY_API_KEY,
});

const version = // some git thing that wasn't working

gulp.src('**/*.js.map')
  .pipe(sentryRelease.release(`${process.env.APP_ENV}-${version}`));
```

### Problem one: versioning

The first thing I had to fix was versioning. Sentry expects you to provide information about a release. If a user is looking at a certain release on your site, then you need to have told Sentry which source maps you are dealing with. We were using a git versioning that stopped working when the company switched to Docker nearly a year ago. Sentry had been looking at everything we pushed to production as `staging-` or `production-`.

I solved this by creating a version in my `package.json` and incrementing it when we push to production with [gulp-bump](https://www.npmjs.com/package/gulp-bump). My gulp task looks like this:
```javascript
if (process.env.APP_ENV === 'production') {
  gulp.src('./package.json')
    .pipe(plugins.bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
}
```

I read from `package.json` to version my sentry release:
```javascript
import { version } from '../../../package.json';
```

and then I can use the same code I had before to send to Sentry:
```javascript
gulp.src('**/*.js.map')\
  .pipe(sentryRelease.release(`${process.env.APP_ENV}-${version}`));
```

#### Adding the release to the code shipped to the browser

This is great for telling Sentry that these source maps belong to this release. But what about the user browsing along on my app and getting an error? The browser needs to be able to tell Sentry which release that person is viewing. In our code, we use the Sentry [Raven client](https://docs.sentry.io/clients/javascript/):
```javascript
Raven.config('our-api-url-for-sentry', {
  release: 'SENTRY_VERSION',
  dataCallback: function(data){
  ...
```

We later regex out the `SENTRY_VERSION` from our code using [gulp-replace](https://www.npmjs.com/package/gulp-replace):
```javascript
import { version } from '../../../package.json';

gulp.src('./html/**/*.html').pipe(plugins
  .replace('SENTRY_VERSION',(`${process.env.APP_ENV}-${version}`)))
```

Now the version in our HTML will match the version we send to Sentry.

Note: when this runs, it will create uncommited changes --- a bump in your `package.json`. You'll need to commit that to your master. It's not the most elegant solution, but it's better than what we had before.

### Problem two: uploading the right source maps

For ages, I thought I had it but Sentry was still trying to grab source maps from the internet. I knew because it was throwing an error saying they could not be found. Indeed, I had not uploaded them to production.

Though gulp-sentry-release has not been touched for three years, it still handles the Sentry API just fine, as long as you manage to pass in the right options:
```javascript
const  sentryRelease = plugins.sentryRelease({
  API_URL: 'https://app.getsentry.com/api/0/projects/our-team',
  API_KEY: process.env.SENTRY_API_KEY,
  DOMAIN: '~'
});
```

Did you miss the change? `DOMAIN` defaults to `''` in this outdated package. Sentry has since decided they want to see a tilde on the front of sourcemaps. When I added this piece, suddenly it all came together.

![Finally seeing human-readable code in Sentry](https://cdn-images-1.medium.com/max/1600/1*cR6nQovjhMXdjDBcl2_D1w.png)

There's a good chance this didn't solve your problem, as Sentry has a whole bunch of documentation on how to [troubleshoot this issue](https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting/). The tilde is just one of many, many problems people have trying to make this work. If you're still on the hunt, best of luck! And if this did help you, I'd love to hear about it.
