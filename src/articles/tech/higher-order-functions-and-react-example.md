---
title: "Higher-order functions: what they are, and a React\_example"
subtitle: "Tech Jargon Series"
draft: false
date: "2019-04-02"
---
There are so many phrases that get thrown around at tech meetups and conferences, assuming that everyone is already down with the lingo. I’m often not down with the lingo. It’s common for developers to act astonished that I lack a piece of knowledge.

The truth is, I often just don’t know the right word for it. As humans, but especially developer humans, we love to dismiss those who don’t “talk the talk”, so this series is about getting a solid understanding of programming concepts that one “should know”.

My first topic for this series is Higher-Order Functions. I was at a tech meetup the other day, and we were discussing React and how difficult it can be for React newbies to get into the code. I mentioned that higher-order components (HOCs) can be tough to understand. A response was that they are much like higher-order functions, don’t I agree? And I said: “I don’t know what that is.” When I asked for an example, I was told “map”. I made a joke about how I have no idea what “map” is and we moved on.

But still: _what is a higher-order function?_

(Note: all the examples given are in Javascript, but this concept applies to every programming language.)

### Higher-order functions: a definition

**A higher-order function is one which either a) takes a function as an argument or b) returns a function.**

If a function doesn’t do either of those things, it is a **first-order function**.

### Map

Let’s start with the example I was given: `map`.
```javascript
[1, 2, 3].map(num => num * 2)  
> [2, 4, 6]
```

The `map` function is called on an array and takes a “callback” function. It applies the function to each of the items in the array, returning a new array. `[1, 2, 3]` is our array and `num => num * 2` is our function. A callback is the function argument passed to our higher-order function.

This HOF is baked into the language, prototyped on Array (`Array.prototype.map`).

Other examples of HOFs prototyped on Array are `filter`, `reduce`, and `some`.

### Custom example

So let’s write our own higher-order function.

#### Passed function
```javascript
const myFunc = age => age * 2
```

#### Higher-order function

Now we write a function that _takes in_ a function.
```javascript
const hof = (customFunc, age) => customFunc(age + 5) 
```

We’ll pass a number to `hof`, which will add 5 and then call our passed function, which will double it. If we pass 10, we pass 15 to our first function, which then doubles to 30.

![Our dead-simple higher-order function running in the terminal](https://cdn-images-1.medium.com/max/1600/1*hihD4HHej1EcMr04jctg9A.png)
### Custom example with React “components”

As I noted above, this topic came up in reference to React’s components. As a React component is a function, when passing it to another function, we are creating our own higher-order function, which React calls “higher-order components”. If you are using stateful components (and extending React’s `Component`), you are already using HOCs.

#### Stateless Component
```javascript
const details = ({ name, randomNum }) =>  
  `${name}, ${randomNum}`
```

We have a function, called `details`, into which we pass `props`. We are deconstructing them as they come in and assigning them to local variables `name` and `randomNum`. This is ES6 syntax — if it looks unfamiliar give it a google (you’ll love it).

This is a **first-order function** — it takes one argument (a `props` object) and returns a template literal.

#### Higher-order component
```javascript
const hoc = (component, props) => {  
  const randomNum = Math.floor(Math.random() * 100)

  return component({ ...props, randomNum })  
}
```

This is a **higher-order function** — it takes in a function (the `component`, which it then calls, passing in additional props). This is an extremely basic example of what every stateless React component is doing.

![Our super-basic “component” running in the console](https://cdn-images-1.medium.com/max/1600/1*SV9bA8FBOWuGCmMBJ22-Jg.png)

You can employ this pattern to abstract code that is shared among many components in your application.

Are you wondering if you can nest higher-order functions? You can! But be careful. Abstractions should make code _easier to read and work with_. It’s easy to get down a path here where your code is so obtuse no one can figure out how to do anything.

### References

*   [Higher-order-function](https://en.wikipedia.org/wiki/Higher-order_function), Wikipedia
*   [Higher-order functions](https://eloquentjavascript.net/05_higher_order.html), Eloquent Javascript (chapter 5)
*   `[Array.prototype]` [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype).
