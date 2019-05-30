---
title: "Remember Javascript developers: zero is falsey"
draft: false
date: "2018-06-20"
---
A short story today, because it’s easy to forget this quirk of Javascript: zero
is falsey. Check this:

    > !!0
    false

    > !!1
    true

    >!!10
    true

![Totally unrelated, but don’t you just love our office dog? I do.](https://cdn-images-1.medium.com/max/1600/1*oZoOofW4jpJGuBR3pfi4pA.jpeg)

How many times do you call something like

    user && user.score && <div> //something </div>

in React? Well guess what — if that `score` is 0, you are in trouble. Zero is
falsey and that code will pause right there — `user.score` having returned
`false`.

### Fix it

Your solution will depend on what is available in your code. I used Lodash:
`!isNumber(user.score)` but you could also try `hasOwnPropery`:

    user.hasOwnProperty('score')

This returns `true` if there’s a `score` in there and false otherwise.

And I just learned this writing this article, check this out!

    > 'score' in user
    true

    > 'garbage' in user
    false

even if I change the user’s score to `0` — awesome and very succinct, this
checks for the existence of an attribute on an object.

### References

[Methods to determine if an Object has a given
property](https://toddmotto.com/methods-to-determine-if-an-object-has-a-given-property/)
