---
title: "Everything I learned from \#Javascript30"
subtitle: "Tech Jargon Series"
draft: false
date: "2019-04-19"
---
First, some exclamations: this was a great series! I highly recommend it! Best
tutorial series I’ve seen — really!

![image from first lesson of #Javascript30](https://cdn-images-1.medium.com/max/2600/1*gIHF0jZL35zG9RbDmSlweQ.png)

Get on board [here](https://javascript30.com/). And find all of my code and
notes [here](https://github.com/AmberWilkie/JavaScript30).

### Quickly: My Javascript background

People, I love programming. Logic makes me very happy. I started seriously
learning about eight months ago. I currently work as a programming teacher. So,
let’s say I have a knack for this stuff. But my home base is in Ruby. With
Javascript I’m less solid. Maybe there’s more to know, or maybe I just haven’t
spent as much time with the beast. I’ve probably spent twice as much time
writing Ruby code as Javascript code.

This tutorial series made me feel like I know what the hell is going on. So
there’s a quick is-this-at-my-level? breakdown. You can do it. Hop on board.

### ES6

So now, knowing my background, let me tell you that I didn’t realize that some
of the stuff [Wes Bos](https://medium.com/@wesbos) teaches is ES6 until he
explicitly mentioned it. I can’t separate the old from the new. Luckily, I tried
using some of this new syntax in a project we’re currently working on at [Craft
Academy](https://medium.com/@CraftAcademy) and it blew up in our emulator — now
I know!

### My note-taking method and what this post is about

I’m a note-taker — it’s how I manage my work and personal lives and everything
in-between. I’m a keeper of notebooks. So believe me that I have a ton of
\#Javscript30 notes scrawled all over some texts. But I wanted to keep track of
the most important stuff, so after every lesson, I would write a README file
with the most important lessons and code from each day. I’ll draw on these notes
in this blog post as review and also to help solidify the knowledge I picked up
over this series.

The original README files are, of course, available in the github repo I link
above.

I’ll try to organize things by concept and not day-by-day. In many cases I had
to do some more research because I had merely been sort of exposed to a lot of
this stuff and needed further clarification before I could write about it.

I’ve peppered the post with screenshots from some of the days because a) photos
and b) Wes did a great job with the design.

Ok, let’s go.

![](https://cdn-images-1.medium.com/max/1600/1*Y2JyFmjV856sRdkb_PT49A.png)

### Variables

I wouldn’t have thought there would be things about *variables* I needed to pick
up, but I was wrong.

#### Three types of Javascript variables

* `const`: Variables declared with `const` cannot be reassigned. Once `const
variable = 'Amber'` it will be `'Amber'` forever.
* `let`: Variables that may need to be reassigned are declared with `let`. If you
attempt to re-declare a `let` variable, you will get an error. Not so with
`var`.
* `var`: Is going out of style with ES6 but is essentially the same as `let`.

These variable types have different scopes. Wes (again) [explains what’s
up](http://wesbos.com/javascript-scoping/).

### Array Methods

Not the most exciting lesson, but critically important array method stuff.

#### Filter

`.filter()` will return elements of an array that match a conditional. You have
to `return true` inside of the conditional to get that array element to be part
of the filtered array:


Or in a more tangible example: `things.filter(thing =>
thing.name.includes('Amber'))`. Will return a list of things whose name includes
'Amber'.

#### Map

`.map()` takes in each element of the array, does something to it, then returns
an array *with the same number of elements as the input array*.


By the by, this is an “implicit” return — we do not have a return statement, but
simply return the only line in the function (this is ES6 notation).

#### Sort

`.sort()` can be called simply on a array of numbers to put them lowest to
highest (and you could use `.reverse()` to get them in the reverse order). But
you can also sort by whatever method you like on more complicated objects.


Where `x` is the first element we are looking at and `y` the next. Return `1` if
you want to move the element “up” and `-1` if you want to move it “down”.

#### Reduce

For whatever reason, `.reduce()` is the hardest to understand of this bunch but
has the easiest implementation:


In the above function you are simply adding up all the numbers in an array
(assumed to contain only numbers) and returning that sum. `0` is the starting
value for the function.

#### Splice

`splice(0, 1)` will remove the first element in an array. `splice(-1, 1)` will
remove the *last*. `splice(0, 5)` will remove the first five elements.

#### Some & Every

`.some()` will loop through until a condition is met, then return `true` or
`false`. `.every()` works the same way, but only returns `true` if *all*
elements in the array meet the condition.

#### Find & FindIndex

`.find()` returns the first item in the array that meets the condition.

`.findIndex()` returns the *index* of the item that meets the condition.

#### Array assignment

Let’s say you have an array: `array = [1, 2, 3]`. Then you want to make a copy,
so you do `array2 = array`. Now we need to change `array2` : `array2 = [2, 3,
4]`. What is `array`? If you think it’s still `[1, 2, 3]`, you are wrong. If you
want to make a new array that *will behave separately from where it was copied*,
you’ll need to use one of these methods:

* `Array.from(array)`
* `[...array]` -> this is ES6
* `array2.push(...array)` but declare `array2` first: `array2 = []`
* `[].concat(array)`

My lovely husband explained *why* arrays in some languages have this property.
Way on back in the day, computer storage was at a serious premium. Why would you
create a duplicate of an array if you could simply “point” back to the original
one? So now you end up with two arrays that are referencing the same set of data
— not an original and a “copy”. This is great when you only have a tiny amount
of space. Now it seems absurd to make the arrays reference the same 1s and 0s. I
don’t have a good explanation for why this continues in modern languages.

The same thing holds true for object “copying”. You’ll have to make a new object
from a current object in order not to affect the original:
`Object.assign(oldObject)`.

#### Mass Assignment

This is some ES6 magic: `[var1, var2] = [something, something_else]`

![](https://cdn-images-1.medium.com/max/1200/1*GHmD3SS0ljm6I7_SEUJpFw.png)

### String Interpolation

I must have known how to do this when I started this series, but I took this
note anyway:

* String interpolation in Javascript is done with back-ticks around `${}` .

I’d love to show you a “practical use” but Medium won’t let me put a back-tick
in code.

### Selecting DOM Elements

One can call `querySelector()` on any DOM element, not just `document`.

### Working with CSS classes

`DOMobject.classList.add('class')` is the vanilla Javascript version of JQuery’s
`$(DOMobject).addClass('class')`.

![](https://cdn-images-1.medium.com/max/2400/1*8qe6Cr03tVAxKRDEDc_OHA.png)

### Events and Event Listeners

During the course of taking this tutorial series, I read an article about event
delegation* that argued this was the wrong way to add an event listener to each
item in a node list. Still, this is how Wes did it, and that’s good enough for
me:

    keys = document.querySelectorAll('keys')
    keys.forEach(key => key.addEventListener('click', functionName);

We used a lot of events: `click`, `transitionend`, `mouseup`, and on and on and
on. There are dozens of [DOM
events](https://developer.mozilla.org/en-US/docs/Web/Events).

#### Form Events

* The `change` event only takes place when the user clicks outside the form
element. `keyup` will fire after the user types.
* `form.reset()` clears all fields of a form.

#### Event Object

By default, when you call `functionName()` above, you can access the event,
which will automatically be passed to the function declaration like so:`function
functionName(e) { // do something with e }`. `e` will contain tons of
information about the event — where on the screen it occurred, what DOM object
the event occurred in, etc.

* `e.scrollY` is how many pixels down the page the user has scrolled when the
event occurred. `window.innerHeight` gives you the height of the browser window.
* `e.isTrusted` returns a boolean about whether this was a "real" mouse click - as
opposed to a programmatic click.

#### This

The other object you have access to is `this`, which refers to the DOM object
where the event occurred. [Here’s a link to read
more](https://medium.com/codetteclub/lets-talk-about-this-bd832e37ee10#.lkod845e6).
Unlike `e`, `this` can be used to make changes, such as
`this.classList.addClass('class')`. If you have a list event listeners, `this`
can be used to distinguish them (figure out where the event occurred) and make
changes to *only* that DOM object.

`this.offsetWidth` gives the width of the thing in question - not related
necessarily to what is set in the CSS, but what the width of the thing actually
is, right now.

#### Event Delegation (Or, how to listen for shit that isn’t there yet.)

Wes did eventually cover event delegation. You can add an event listener on the
parent (like a container div), then use `e.target` to find out which child
element was clicked / transitioned, whatever.

For instance, if you have a `div` that contains a bunch of `li`, you could use
`.match()` to find the one that has the text you’re looking for. You’ll just
throw a simple `if` statement in the event function so that it will only fire if
the right `li` element is clicked.

![](https://cdn-images-1.medium.com/max/1200/1*5Q0D0fWUjDxh7YlEn3txxA.png)

### Debouncing

Wes mentioned debouncing, and then I saw it in some article about skills that
are expected of Javascript programmers. So I did some more digging in.

**A debouncing function limits the frequency with which a function can fire.
**You want one if you are firing events on things like scroll or window resizing
or other events that occur at a rapid rate.

Wes recommended you just look up a debouncing function when you need one, so
I’ll just drop the end-result and [give you the link to where I got
this](https://davidwalsh.name/javascript-debounce-function):

    var myEfficientFn = debounce(function() {
    	// All the taxing stuff you do
    }, 250);

### Local Storage

Local Storage is the place we can put small amounts of information and keep them
in the browser semi-persistently (users can reset their local storage at any
time and the information will expire.) You can only store strings in local
storage, so here comes JSON to the rescue:

* `localStorage.setItem('key', value)` Saves to local storage.
* `localStorage.getItem('key')` retrieves.
* If you need to store something other than a simple string, use
`JSON.stringify()` and `JSON.parse()`
* `thing = otherThing || []` - reminder: this will create a new array if the
`otherThing` doesn't exist or is null

![](https://cdn-images-1.medium.com/max/2600/1*K_IUfm4d3bYUdnFutgqufQ.png)

### HTML tag stuff

#### Media

We did lots of really fun stuff with media. I learned a lot about working with
sound and video files in the browser.

* `<audio>` can hold a sound file (referenced by `href`). Use `.play()` to play
it!
* Available methods on video media:`.duration`, `.currentTime`, `.play()`,
`.pause()`

#### `Data tags`

`<div data-description='something' class='what'>` allows you to access this div
with `document.querySelector('.what')` and then call `.dataset.description`on it
to get out `'something'`. Really neat!

#### Creating and adjusting HTML elements with Javascript

* `document.createElement('a')` makes a link, that can then have stuff done to it,
like `.setAttribute()` or `.href = 'whatever'` Cool!
* `.innerHTML = 'whatever'` puts stuff inside tags - so when we create that
`<a></a>` above, `innerHTML` puts stuff inside of it, like text or an image.
* `.appendChild(DOMobj)` will add a DOM element right after another.

#### Random

* `<kbd></kbd>` will format text plainly in-line. Good for escaping out of a lot
of CSS mumbo-jumbo?
* `<input type='color'>` will pull up a color picker!
* `.getBoundingClientRect()` will grab X, Y, width, height of the HTML element -
available through `this` on events.
* If your html element has a name attribute, you can just use
`document.elementName` to grab it. If your page has a title, you can use
`document.title`.

### CSS Stuff

I work with CSS almost every day, but there’s so much stuff I don’t know. I’m no
designer — I just cobble stuff together. It’s honestly not a place I’ve put a
lot of time and effort into. Logic is more fun. So I realize this stuff is
really basic but it was new(ish) to me:

#### Transform

* `transform: rotate(90deg)` will, obviously, rotate the object
* `transform-origin` changes the inflection point of rotation
* `transform: translateY(100%)` moves an element completely off-screen
* `transform: scale(0.98)` animated to `transform: scale(1)` is a really nice
“focusing” effect

#### Transition

* `transition: all .5s` animates changes to CSS properties — really useful
* `transition-timing-function` makes for various transitions

#### Variables in CSS

     

You can also set variables in-line: `<html style='--base: #fff'>`. If you put
the variables in the `:root` you can change them like so:
`document.documentElement.style.setProperty('--base', ‘20px')` and change them
throughout the DOM.

#### Flexbox

We only did one video with the new CSS flexbox, so I’m not all that comfortable
with it. The notes I took are:


This parent-child relationship allows all the `.inside-div`s to space out
evenly. You can use a `flex` of different values to space them differently.

`flex-direction: column` aligns things inside the flexbox top to bottom.

#### Miscellaneous

* `.class > *:first-child {}` refers to the first element inside a div. So if you
have a list or something, you can use this to not display the line above list
items (or use `:last-child` etc.)
* HSL is a color-picking guy that takes color as 0–360, saturation as 0–100% and
shade as 0–100% and looks like: `hsl(25, 50%, 50%)`

![](https://cdn-images-1.medium.com/max/1200/1*o4qlQt_w_-xBFDHERKrSOQ.png)

### Event Propagation, Bubbling & Once

If you consider a bunch of nested divs, if you click on the most “child” div, do
you think you are only clicking on that div? No, you are clicking on all of the
parents, and also the window. That `click` is registered first in the window and
then down through the divs. That is event capture.

An event is fired from the “inside out” — that is, it occurs first in the
innermost child and then moves “out” through the DOM. That is called event
“bubbling” or “propagation”. You can put an end to that with
`e.stopPropagation()`. If you prefer to have events fire from the outside in,
you use `capture: true`.

#### Once

If you add `once: true`on an `eventListener`, it will allow the event to fire
only once, then unbind itself so no further "clicks" (or any other event) will
be allowed.

### Miscellaneous

* `if (something) return;` This will bail on the running function if the condition
is met.
* `setInterval(functionName, timeInMilliseconds)` will do a thing every
`timeInMilliseconds`. To stop it, you have to save the interval in a variable,
then run `clearInterval(variable)`.
* `setTimeout(functionName, timeInMS)` will do a thing after a certain period of
time has passed — it is a delay for a function.
* I can’t believe I didn’t know this before this tutorial, but `__proto__` is the
list of methods that can be called on the object. You see it all the time in the
console.
* It’s too much for this write-up, but it’s just not a whole lot of code to get a
canvas on your website that you can paint on. [Find the code
here](https://github.com/AmberWilkie/JavaScript30/tree/master/08 - Fun with
HTML5 Canvas). `globalCompositeOperation` has all kinds of fun overlay things.
* `.trim()` deletes trailing whitespace.
* `.join('')`, of course, makes an array one big string. But if you are seeing a
bunch of commas between your HTML elements, this is missing.

#### Regex

You can use `.match(regexVariable, 'gi')` to find occurrences of a regular
expression. You can define a regular expression like this: `const regex = new
RegExp(word, 'gi')` with flags `g` for global and `i` for case insensitive. If
you want to replace, you can use `replace()` in the same way but it will only
take care of the first occurrence.

`.replace(/^(a |the |an )/i)` will replace any of those words.

#### Math

* `Math.floor()` rounds down (1.9 will round to 1). `Math.ceil()` rounds up.
* `.toFixed(2)` gives you a number with two decimal places (0.25).

#### Time

`Date.now()` gives timestamp in milliseconds. `new Date(milliseconds)` produces
a date object, on which can be called: `.getDay(), .getHours(), .getMonth()` and
lots of other stuff, good times.

![](https://cdn-images-1.medium.com/max/1600/1*xklb0zcCmxVAlEUzmhGdnw.png)

#### Speech Recognition & Speech Synthesis

[Day 20 - Speech Detection](https://github.com/AmberWilkie/JavaScript30/tree/master/20) was seriously awesome and I got so excited I started working on a
text-to-document tool. Then I abandoned it because my husband was getting really
annoyed with me developing it at home.

Anyway, HTML5 comes with this amazing speech recognition API that is already
built in and you can start using it right away:

* `const speech = window.SpeechRecognition` Add an event listener for `'result'`
and another for `'end'` that will start listening again.
* Follow the array-like object down the chutes until you get to `transcript`.
There's also `isFinal` that goes to `true` if the thing detects you have stopped
talking.
* You can use `transcript.includes('hello')` to do literally anything at all when
a particular phrase is detected (make sure to debounce it so it doesn't run a
thousand times while the browser figures out what you are saying).

And my notes on speech synthesis:

* `var msg = new SpeechSynthesisUtterance()` will create a new instance of an
utterance. It holds `rate`, `pitch`, and `text` options, which we can set
programmatically.
* You can’t grab the voices available on page load because the request takes a
minute. Have to add an event listener somewhere before you set something equal
to the voices.
* To speak: `speechSynthesis.speak(msg)` To stop: `speechSynthesis.cancel()`

#### Console Logging Tricks

I started using these the day I learned them:

* `console.dir()` puts the object into the console so you can drill down into it
(instead of seeing an output like `[object Object]`.
* `console.table()` prints a table
* `console.log({variable})` will have an output like `Obj {variable: 'value'}`
* `console.time('thing') ... console.timeEnd('thing')` -> measures the time it
takes for part of the program to run. Put `timeEnd` inside the function you are
testing, at the very end.

And these are cool but not as useful:

* `console.log('%c some log', 'font-size: 20px')` styles the console log
* `console.warn('No!')` makes the log yellow
* `console.error('Hell no!')` makes the log red
* `console.info('Facts')` makes the log have a blue exclamation point
* `console.assert(varX == varY, 'varX did not equal varY')` only displays log if
condition is not met.

### You’re the best

If you actually got through all of this. Send me recommendations for more stuff
like this — I’m always looking for the next awesome thing to learn.
