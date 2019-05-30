---
title: "Promises in Javascript: I’ll tell you about it later"
draft: false
date: "2017-06-09"
---
Beginner Javascript coders use promises for Ajax calls and the like, but we
don’t really understand what is going on under the hood. I recently watched Kyle
Simpson’s [Advanced Javascript
course](https://app.pluralsight.com/library/courses/advanced-javascript/table-of-contents)
on Pluralsight and, among other things, took a bit of a deep-dive into promises.
Naturally, I still didn’t understand what the hell was going on, so I wrote this
blog post.

![cool archway in Morocco](https://cdn-images-1.medium.com/max/2600/1*QTO52XwDlRt_p1Ax_D77uQ.jpeg)

### What is a Promise?

Simply put, a promise is a placeholder that waits until it receives more
information to continue. Kyle had a brilliant metaphor of buying fast food. You
give them money, they give you a receipt (a promise), and then later when your
food is ready, you exchange that receipt for your dinner. Promises work the same
way. You tell them when they can expect to be “resolved” and when they are, they
continue with whatever it was you told them to continue with.

You can instantiate a promise like so: `const myPromise = new Promise(resolve,
reject)` where `resolve` is a function you want to happen when the promise gets
its data and `reject` is what to do if the Promise receives an error.

### Resolving Promises

It’s easier to think backwards a bit. Your `resolve` function is what you want
to happen when your promise is resolved. Let’s have something stupid-simple:

    function resolveIt (resolve) {
        console.log('resolving in 5 seconds');
        setTimeout(() => {
          resolve(); 
          console.log('resolved')
        }, 5000);
    }

In five seconds, our program will resolve the promise and log to the console.
Note that we are ignoring the `reject` parameter — our program will fail
silently if it fails.

Now we can stick it into a promise:

    const promise = new Promise(resolveIt);

`promise` actually returns a lot of useful information:

    > Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}

Note that it is `pending` and it will continue to be pending until that
`resolve` function is called. Note also that we did not have to pass in
`resolve` and `reject` parameters to our `resolveIt` function — the Promise
seems to take care of that automatically.

So great. We wait five seconds, `promise` is resolved and our return statement
looks like:

    > Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: undefined}

But what if we wanted to do something as soon as that promise was resolved? Say,
we had requested information from a database or an API and needed our program to
execute some functions after that data was returned. Enter `.then()`.

### then is then

`.then()` is a super-handy function that runs when a promise is resolved.

If we wait our five seconds and run `.then()` on our `promise`, it will trigger
immediately — we are running a callback on an already-resolved promise:

    promise.then( () => { console.log('then') } )

(I’m using ES6 syntax here. If that’s confusing, you may as well stop now and
research fat arrow functions because this stuff is everywhere.)

That will just go ahead and log `then` immediately.

But if we are very quick, and run that line before our five seconds is up, the
`then` log will wait until the five seconds has elapsed.

![console log example of promises](https://cdn-images-1.medium.com/max/1600/1*FRArEa8clEM24vNh5Dr6_w.png)

Of course, in the real world, we don’t have to jump in quick before we set the
`.then()` — we wouldn’t wait to call the `.then()` function at all, but just
chain it naturally onto the promise. I want to demonstrate here that our promise
is “pending” during those five seconds.

### Condensation

I can make all of that much shorter:

    const promise = Promise.resolve('yo!')
                           .then(() => { console.log('success!')})

We immediately call the `resolve()` function, and since we resolved `promise`,
then `.then()` call runs immediately.

Note also that we can see the `.reject()` behavior in this format:

    const rejected = Promise.reject('yo!')
                            .then(() => { console.log('failure!')})

Note that this throws an error because Javascript expects you to handle the
rejection. It complains that you do nothing with `'yo!'`.

One more note: the arguments passed to the `resolve()` and `reject()` functions
will automatically pass down into the `.then()`:

    const promise = Promise.resolve('yo!')
                           .then((text) => { console.log(text)})

logs `yo!`.

And last-last note, if you are going to immediately resolve or reject your
promise, skip all of that nonsense and just get right to the execution. This is
for breakdown purposes.

### Further Reading

* [The Mozilla docs on
Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).
What would we do without you, Mozilla?

* [JavaScript](https://medium.com/tag/javascript?source=post)
* [Promises](https://medium.com/tag/promises?source=post)
* [Web Development](https://medium.com/tag/web-development?source=post)
* [Learning To Code](https://medium.com/tag/learning-to-code?source=post)
* [Tutorial](https://medium.com/tag/tutorial?source=post)

### [Amber Wilkie](https://medium.com/@heyamberwilkie)

Software developer, mostly Ruby and Javascript. Yogi, Traveler, Enthusiast. All
photographs mine. I don’t read the comments — try me on Twitter.
