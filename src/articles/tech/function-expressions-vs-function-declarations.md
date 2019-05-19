---
title: "When to use a function declaration vs. a function expression"
subtitle: "Tech Jargon Series"
draft: false
date: "2019-04-19"
---
It's likely you already know how to write functions in both these ways.`function doStuff() {}` and `() => {}` are characters we type all day. But how are they different and why use one over the other?

Note: Examples are given in JavaScript. YMMV with other languages.

### The first difference: a name

When you create a function with a *name*, that is a function declaration. The name may be omitted in function expressions, making that function "anonymous".

Function declaration:

```javascript
function doStuff() {};
```

Function expression:
```javascript
const doStuff = function() {}
```

We often see anonymous functions used with ES6 syntax like so:
```javascript
const doStuff = () => {}
```

### Hoisting

Hoisting refers to the availability of functions and variables "at the top" of your code, as opposed to only after they are created. The objects areinitialized at compile time and available anywhere in your file.

Function declarations are hoisted but function expressions are not.

It's easy to understand with an example:
```javascript
doStuff();

function doStuff() {};
```

The above does not throw an error, but this would:
```javascript
doStuff();

const doStuff = () => {};
```

### The case for function expressions

It might seem like function declarations, with their powerful hoisting properties, are going to edge out function expressions for usefulness. But choosing one over the other requires thinking about when and where the function is needed. Basically, who needs to know about it?

Function expressions are invoked to avoid polluting the global scope.Instead of your program being aware of many different functions, when you keep them anonymous, they are used and forgotten immediately.

#### IIFE

The name --- immediately invoked function expressions --- pretty much says it all here. When a function is created at the same time it is called, you can use an IIFE, which looks like this:
```javascript
(function() {})()
```

or:
```javascript
(() => {})()
```

For an in-depth look at IIFEs, check out [this comprehensive article](https://mariusschulz.com/blog/use-cases-for-javascripts-iifes).

#### Callbacks

A function passed to another function is often referred to as a "callback" in JavaScript. Here's an example:
```javascript
function mapAction(item) {
  // do stuff to an item
}

array.map(mapAction)
```

The problem here is that `mapAction` will be available to your entire application --- there's no need for that. If that callback is a function expression, it will not be available outside of the function that uses it:
```javascript
array.map(item => { //do stuff to an item })
```

or
```javascript
const mapAction = function(item) {
  // do stuff to an item
}

array.map(mapAction)
```

though `mapAction` will be available to code *below* its initialization.

### Summary

In short, use function declarations when you want to create a function on the global scope and make it available throughout your code. Use function expressions to limit where the function is available, keep your global scope light, and maintain clean syntax.

### References

-   [Function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function), MDN docs.
-   [Function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function), MDN docs.
-   [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), MDN glossary.

### The Tech Jargon Series

There are so many phrases that get thrown around at tech meetups and conferences, assuming that everyone is already down with the lingo. I'm often not down with the lingo. It's common for developers to act astonished that I lack a piece of knowledge.

The truth is, I often just don't know the right word for it. As humans, but especially developer humans, we love to dismiss those who don't "talk the talk", so this series is about getting a solid understanding of programming concepts that one "should know".

This is the second article in the series. The first was [higher-order functions](https://medium.freecodecamp.org/higher-order-functions-what-they-are-and-a-react-example-1d2579faf101). Look out for more as I go to meetups and conferences and pretend to know what my fellow techies are talking about, but then have to go home and Google it.
