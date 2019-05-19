---
title: "What I learned about React working with AngularJS"
draft: true
date: "2019-05-23"
---
Yes, you heard that right - the original Angular. I recently began a new job that uses AngularJS, after having previously worked at a company with products written in React. It's been very interesting to learn AngularJS after having worked with a later framework. I've come to understand something about how React was built as a response to frameworks like Angular and why it has come to be the preferred frontend framework.

It will come as no surprise that I loved working with React, and taking a "step down" to AngularJS caused me considerable consternation. On the plus side, I've earned a deeper understanding of React itself that I hope will serve me well in the future.

- Need to do a little research into AngularJS - was it the first real framework? Some props need to be given here, surely.

# Dependency injection vs. require
The first mental hurdle I came across was something Angular calls "dependency injection". It's easiest just to share an example from the docs:
```javascript
someModule.controller('MyController', ['$scope', 'greeter', function($scope, greeter) {
  // ...
}]);
```
What you see here is a controller, defined by a function that can take in any number of modules. When I first walked up this code base, I kept looking for the function definition that would show what these modules are and where they are defined. No, things like Angular's built-in `$scope` and a project-defined `greeter` are available globally in the app, and they must be injected into the functions that want to use them.

Here's what this would look like in React:
```javascript
import $scope from '$scope'
import greeter from 'greeter'

const MyController = () => {
  // ...
}
```
Not only is this code much clearer about what it does, it is much closer to being "just Javascript". The plain language, outside of any framework, defines functions and which arguments they will accept. The very concept of a function allowing any number of modules seemed absurd to me, coming from a React world where functions operate as regular Javascript functions.

# Normalization
Angular takes huge advantage of an HTML property that allows you to set data attributes of any value on DOM elements, like so: `<div data-my-text />`. To make this work, Angular sets variables to names like `my-text` and then can pass data down to DOM elements. Unfortunately, that is not a valid Javascript, so Angular then translates. 

 
Normalization is the process of converting `my-text` into `myText`. But if you are like me in the first few days of using Angular, you'll be dumbfounded how myText needs to be referenced in the DOM as `my-text`. It's not a huge mental hurdle, but it does prevent you from easily finding all instances of your variable throughout the code. 

 
React requires no translation of variable names to DOM elements, because it does not exploit `data-` attributes as a primary means of rendering HTML. Again, it is "just Javascript", whereas Angular requires the mental overhead of dealing with variables with multiple casings.
- bindings with random symbols you have to memorize
- Javascript used where you are expecting a string
- custom for loops, as opposed to .map
- two-way binding
- custom HTML attributes like ng-click as opposed to JS event listeners or React onClick functions
- So handy to use Javascript in HTML.
