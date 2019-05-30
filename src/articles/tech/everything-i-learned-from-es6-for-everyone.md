---
title: "Everything I learned from ES6 for Everyone"
draft: false
date: "2017-04-12"
---
## A summary of the key concepts from [Wes Bos](https://medium.com/@wesbos)’ “ES6
for Everyone” [course](https://es6.io/), plus a bunch of research.

After I took (and loved) [Wes Bos](https://medium.com/@wesbos)’ #Javascript30
[course](https://javascript30.com/), I [put together all of my notes on
it](https://medium.com/craft-academy/everything-i-learned-from-javascript30-d8d2db246b7)
and the internet said “hell yes”. It’s almost certainly my most widely-read post
of all time, plus it definitely helped me to write it. And I wanted to throw
some money at Wes, who certainly deserved it after that baller Javascript
course. So I dropped some coin, went through the videos and now it’s time for
another summary post.

![pigeons in Poland](https://cdn-images-1.medium.com/max/2600/1*HbqDdPMxcJvZKH4rIoKjHA.jpeg)

### What is ES6?

ECMAScript 6 is a version of Javascript that was released in 2015. You will
often hear developers talk about something being written in “modern” Javascript,
and by that they mean anything ES6 and higher (8 is currently getting wrapped
up). The previous update to Javascript (ES5) was released in 2009, so it was a
big upgrade.

#### Why it’s great

Anyone who has written the “old” Javascript knows how much of a pain it is to
deal with the word `function` everywhere, something referred to as “callback
hell” (we’ll get into it), and troublesome variable scoping problems. Es6
attempts to solve all of those and much, much more.

A few things this blog post will cover:

* Arrow functions
* Template literals
* …Spread operator
* New `Array` methods
* Destructuring
* Plus lots more

Ok let’s dive in!

#### Variables

I already covered the new variables in my #Javascript30 write-up, but briefly:

* `const` cannot be reassigned.
* `let` can be
* `var` has its uses, but they are few

### Arrow Functions

The most visible sign that you are working with “modern” Javascript is the
presence of arrow functions. Here’s some Javascript that you might recognize:

    function dude() { 
      console.log('hey dude') 
    }

And here’s the same code in ES6:

    const dude = () => { 
      console.log('hey dude') 
    }

We kick out the word `function` and use a “fat arrow” ( `=>` ). We’ll put
arguments into that `()` if we have some. If not, we need an empty set. We call
both of these methods with `dude()`.

#### Arguments in arrow functions

When we need to pass in arguments to arrow functions, we do so like this:

    const dude = (name, age) => { console.log(name + ' is ' + age) }

If we only have one argument, we can drop the parentheses:

    const dude = name => { console.log('hey ' + name) }

And again, if we have no arguments, we need an empty set:

    const dude = () => { console.log('hey dude') }

#### The arguments keyword

This was new for me! Check it:

    function myArguments(name, age) {
        console.log(arguments)
    }

When I call `myArguments('Amber', 33)` I get a list of the arguments I passed
in! (Plus some other stuff)

![](https://cdn-images-1.medium.com/max/1600/1*5I5CUpaWv_s1NO7VGUiUMQ.png)

So I did learn that during this course, therefore it counts. But you need to
know: **the **`arguments`** keyword is not available to arrow functions.** It’s
just not:

![](https://cdn-images-1.medium.com/max/1600/1*KFvTpcmGeGegErsVqO90TQ.png)

#### Scoping `this`

One important thing to know about arrow functions is that the `this` keyword is
not rebound inside of one. (I am running this code against
[es6.io](https://es6.io/), so you can feel free to head over there, pop open the
console and play along.) The difference between these two bits of code is that
`this` is a DOM element whose `textContent` is “ES6” here (if you click on ES6):

    const title = document.querySelector('span.es6')
    function getSpan() { console.log(
    .textContent) }
    title.addEventListener('click', getSpan)

and is the entire contents of the window here:

    const title = document.querySelector('span.es6')
    const arrowSpan = () => { console.log(this) }
    title.addEventListener('click', arrowSpan)

`this` was not re-bound in `arrowSpan()` so it stayed where it was — as the
entire window.

![](https://cdn-images-1.medium.com/max/2600/1*vjrd6mhQ05wqqE7Qo46ZXg.png)
<span class="figcaption_hack">Demonstrating the use of the “this” keyword in arrow functions</span>

#### Implicit returns

A simple, great thing that arrow functions can do is implicit returns: returns
that don’t require a `return`. Good times!

    const implicit = () => true

When we call `implicit()` we get `true`. For reference, here’s regular syntax:

    function implicit() {
      return true
    }

#### An example: map

When we start throwing functions inside of other functions, we really get the
benefit of the paired-down syntax.

    const array = [1, 2, 3, 4]
    array.map(num => num*2)

Regular syntax looks like this:

    var array = [1, 2, 3, 4]
    array.map(function(num) {
      return num*2
    })

#### Returning object literals

If you are returning an object literal, you’ll need to wrap your object return
(in `{}` ) in `()`:

    var dude = () => ( { name: 'Amber' } )

And calling `dude()` will return an Object with `name` attribute. No being
sneaky and just using `return { name: 'Amber' }` — returning objects has
slightly different rules.

Arrow functions are always anonymous functions, even when stored in a variable.

### Other new function stuff

#### Default arguments

This one is long overdue and works with the regular syntax:

    function defaultBill(name = 'Bill') { console.log(name) }

If we call `defaultBill()`, we get `'Bill'`. And if we call
`defaultBill('Anna')`, we get `'Anna'`. Nice.

### Destructuring

Syntax that you will love. Examples and uses:


Now we have `first == 'Amber'` and `last == 'Wilkie'`.

    food = ['hotdog', 'soda']
    const [eat, drink] = food

Now we have `eat == 'hotdog'` and `drink == 'soda'`.

We can also get down into objects:

    const person = { 
      name: 'Amber', 
      favorites: { 
        food: 'French fries', 
        place: 'Ghent' 
      } 
    }

    const { food, place } = person.favorites

Note that you have to name the variables here `food` and `place` (to match the
object) unless…

#### Renaming destructured variables

    const { food: favoriteFood, place: favoritePlace } = person.favorites

Now we can use whatever we like for those variable names. `favoriteFood ==
'French fries'`.

#### Default values with reassignment

Just like with function definitions, we can set default values for destructured
variables:

    const game = { time: '15:30', place: 'East field', manager: 'Roy' }
    const { time, place, manager, hotdogs = 0 } = game

The other variables are assigned as we expect, and `hotdogs == 0`.

#### Easily swap variables

No need for temporary variables:

    person1 = 'Jeff'
    person2 = 'Susan'
    [person1, person2] = [person2, person1]

Now `person2 == 'Jeff'` and `person1 == 'Susan'` — they have swapped values.

#### Automatically destructure information returned from a function

    function twoOperations(num) { return [num*2, num/2] }
    const [timesTwo, divideTwo] = twoOperations(5)

This is particularly helpful when grabbing information from an API. If you are
getting a big JSON object back, split it up as it comes in instead of needing to
store each object individually.

#### Destructure as you pass an object into a function

    const fullName = ({first, last}) => `${first} ${last}`
    fullName({first: 'Amber', last: 'Wilkie'})

As we pass the object into the function, it is automatically destructured into
`first` and `last` variables. No need to manually assign them inside the
function.

You can also set defaults here:

    const fullName = ({first, last = 'Anonymous'}) => first + ' ' + last
    fullName({first: 'Amber'})

will return `'Amber Anonymous'`.

If you want to default to a blank object, simply set the default as `{}`.

#### Extra information is ignored

Note that we can add information, but if we don’t have a placeholder for it,
additional information is ignored:

    const animals = [ 'rabbit', 'bear', 'hedgehog', 'turtle']
    const [animal1, animal2] = animals

The other two animals are not assigned to a variable. We can fix this easily
with…

### The spread operator

More super-handy syntax:

    const jewelry = ['ring', 'necklace']
    const electronics = ['tv', 'ipad']
    const valuables = [...jewelry, ...electronics]

Check it, `valuables == ['ring', 'necklace', 'tv', 'ipad']`. No need to know how
many items are in each array and no need to manually loop and `.push()`.

So if you forgive a jump back into destructuring for a sec, we can capture the
“rest” of those animals with:

    const animals = [ 'rabbit', 'bear', 'hedgehog', 'turtle']
    const [animal1, animal2, ...otherAnimals] = animals

`otherAnimals` is an array containing hedgehog and turtle.

### Template literals

New template literals make me so happy. I’m used to really great string
interpolation in Ruby and trying to finagle that in Javascript has been a beast.
ES6 to the rescue! Here’s our standard string interpolation:

    function myDetails(name, age, city) { 
      console.log(name + ' is ' + age + ' and lives in ' + city)
    }

Well that’s ugly. Try:

    function myDetails(name, age, city) { 
      console.log(`${name} is ${age} and lives in ${city}`)
    }

We’ll use back-tics to indicate that we are going to have a string with some
code bits inside of it. And we put those code bits in `${}`. Remember that we
don’t have to simply print out a variable — we can put whatever Javascript code
we want inside of those `${}`.

#### Multiple lines

![](https://cdn-images-1.medium.com/max/1600/1*KLU-M1-DX8e2Jk5p4z5DbA.png)
<span class="figcaption_hack">Using template strings to have multi-line strings with or without interpolation</span>

#### Tagging

Here’s what actually happens when we use string interpolation: the whole
contents of the block (from back tic to back tic) are passed into a function,
which simply runs the Javascript between the placeholders (the `${}` ) and then
joins everything into a single string. If we tag a template literal, we can use
that function instead of the default:

    function dude(strings, ...values) = { console.log(strings, values) }

To send our template literal through our function, we simply write it in front
of the template literal:

    dude`some strings and ${'some interpolation'}`

And look what we get:

![](https://cdn-images-1.medium.com/max/1600/1*ILM-59mZnH2glh10qdt4mQ.png)
<span class="figcaption_hack">Tagging ‘dude’ console logs the strings and values from the template literal</span>

I could give an example, but Wes does in the series, so you can just go ahead
and watch it. 😉

### Loops

#### for / in

for / in loops will iterate over an array and store the *index* of the item.

    const cities = ['Gbg', 'Stockholm', 'Oslo']
    for (const city 
     cities) { 
      console.log(city)
    }

This console logs not actual cities but 0, 1 and 2. If you want to get the
object, you’ll need to use `cities[city]`.

This type of loop will also return any prototypes on the array. If you have
extended `Array` for any reason, it will show up in your loop.

#### for / of

Wouldn’t it be great if we could skip that second step where we access the item?
This new loop does that.

    const cities = ['Gbg', 'Stockholm', 'Oslo']
    for (const city 
     cities) { 
      console.log(city)
    }

Now we get Gbg, Stockholm and Oslo in the console.

If we want to ignore / skip some parts of our iterable, we can use `continue`:

![](https://cdn-images-1.medium.com/max/1600/1*reyXmCsmdub9ob2NlurZsQ.png)
<span class="figcaption_hack">Using continue in a for/of loop</span>

If we need access to that index, we can simply use a slightly different syntax:

    for (var [index, city] of cities.entries()) { 
      console.log(city, index) 
    }

Note that we are destructuring `index` and `city`.

for / of loops can work on any iterable, not just arrays: node lists,
`arguments`, etc.

![](https://cdn-images-1.medium.com/max/2600/1*RIq2hXCB4nhEC81Lf53xRw.jpeg)
<span class="figcaption_hack">Why pigeons? Why not?</span>

### Array methods

ES6 provides some fun and handy new array methods.

#### Array.from()

Turn array-ish things into arrays:

    const listItems = document.querySelectorAll('li')
    Array.from(listItems)

Put in a node list, get out an array.

A second argument accepts a map function!

    Array.from(listItems, listItem.value => value*2)

That’s cool, man.

#### Array.of()

Put stuff in, get out an array:

    Array.of('Chocolate', listItems, 135)
     => ["Chocolate", NodeList(91), 135]

#### array.find()

    const array = [1, 2, 3]
    array.find( num => {
        if(num % 2 == 0) {
            return true
        }
    })

`.find()` loops over the items in our array and uses a function to look for a
`return true`. When it does, it will return that array element.

But check it, we can refactor the hell out of this guy. We just need to return
`true` if a condition is met. That means we can use implicit return:

    const array = [1, 2, 3]
    array.find( num => num % 2 == 0 )

Use `.findIndex()` if you want the index and not the actual item.

#### .filter()

Use this as the same as `.find()` except get all the elements that match and not
just the first.

### String methods

Unfortunately all of these are case-sensitive and if you need more control than
that, you’re back at Regex.

* `.startsWith()`

Self-explanatory, except that `.startsWith('Am', 3)` will skip the first three
characters and keep looking.

* `.endsWith()`
* `.includes()`
* `.repeat(#)`

`'abc'.repeat(2)` gives `'abcabc'`.

### Classes

ES6 sees the addition of real classes to Javascript. By convention, we
capitalize the class name:

    class House {
        constructor(address) {
            console.log(address)
        }
    }

We require a `constructor()` method and instances of classes are created with,
for instance, `new House('Vallgatan 24')`. Notice that we don’t need to do the
`className: function() {}` business — we just get straight to the method
declaration.

Classes can include additional methods that can be performed on those instances.
We can also use prototyping to add methods after instances have been created.

    class House {
        constructor(address) {
            console.log(address)
        }
        sell(sellingPrice) {
            const fees = 890
            console.log(`You made ${sellingPrice - fees} dollars!`)
        }
    }
    House.prototype.remodel {
      console.log('remodeling')
    }

Even if a bunch of stuff happened to an instance of house before the program
adds the prototyped function, our house instance will be able to do those things
too. Note that there is no comma between the class method definitions (seems
wrong, but just go with it).

#### Methods on the class itself

If we want to be able to call a method on the class itself — the blueprint — we
use `static` in front of the function definition:

    class House {
        constructor(address) {
          console.log(address)
        }
        static buildingMaterials() {
            return [ 'wood', 'brick', 'plaster', 'stone']
        }
    }

Now we can call `buildingMaterials()` on the `House` itself — *not* on
individual instances of `House`: `House.buildingMaterials()` and not
`house.buildingMaterials()`.

#### Manipulating additional attributes

It’s all well and good to create a house with some attributes (we would pass
them in with the constructor) but we can also have control over how attributes
are set or retrieved with getter and setter methods:

    class House {
        constructor(address) {
            this.address = address
        }
        set (windows, number) {
          return this[windows*2] = number;
        }
        get (windows) {
          return this[windows/2]
        }
    }

(Not gonna lie, this one took me forever to get right. Apparently it’s easy for
people who know C. I’m not one of them.) Anyway! Here’s how you get and set
`windows` on the `house`. We don’t need this if we’re simply setting a new
attribute — we can do that already by just assigning it: `house.owner =
'Betty'`. But if we want to do some stuff to the values getting passed in or the
return as it comes out, we’ll need to use a getter and/or setter.

#### Extending classes

ES6 gives us standard class inheritance:

    class Apartment extends House {
        constructor(tenants) {
            super()
            this.tenants = tenants
        }
    }

Our `House` doesn’t take any `tenants` argument, but apartments do. Note the
`super()` which actually creates a `House` object and then does a bunch of
additional stuff to it.

Wes goes into some detail about why you might want to extend native classes,
like `Array` but we’ll let that be.

### Sets

Sets are like arrays, but are not index-based and you can’t use them to access
the individual items stored inside. Moreover, each item in a set must be unique.
Push the same thing in as many times as you like, you’ll still only have one. As
far as I can tell, the unique thing is why anyone cares about sets. Here’s how
you use them:

    const array = ['green', 'blue', 'yellow']
    const colors = new Set([...array]) // note the spread operator
    colors.add('red')
    colors.delete('green')
    colors.size
    colors.clear() // deletes everything in the Set
    colors.has('yellow') // returns true
    colors.values() == colors.keys() // these do the same thing

To iterate over the Set:

    const colorNames = colors.values()
    colorNames.next()

This returns an object: `Object {value: "blue", done: false}`. You’ll see more
about this `.next()` in the Generators section. We can use it to loop through
our Set. But keep in mind: *when we call *`.next()`* on that SetIterator, we
remove that value from it.*

![](https://cdn-images-1.medium.com/max/1600/1*ecEUywVcBtwLeGaA1bleFA.png)
<span class="figcaption_hack">Demonstration of items being removed from SetIterator</span>

#### WeakSet

The only reason I can see why you’d want a WeakSet is for its garbage-collection
properties. All the good things available in a Set disappear in a WeakSet but it
will clean itself up when objects stored inside it are removed. Wes goes into
detail about this.

### Maps

Maps are like Sets, but with key-value pairs (one might draw a reference to
arrays vs. hashes from Ruby). Here’s how you use them:

    const myMap = new Map()
    myMap.set('color', 'blue')
     => Map(1) {"color" => "blue"}
    myMap.set('shape', 'square')
     => Map(2) {"color" => "blue", "shape" => "square"}
    myMap.set('shape', 'circle') // overwrite a value
     => Map(2) {"color" => "blue", "shape" => "circle"}
    myMap.get('color')
     => "blue"

You can call `.forEach()` and use for / of loops on Maps. Use destructuring to
automatically grab the key and value when looping:

    for (const [key, value] of myMap) {}

One other cool thing here: **you can use objects as keys**.

#### WeakMap

Just like a WeakSet, these are not enumerable (you can’t reference them by index
or get individual items out based on an index) but they will clean themselves up
as objects are deleted.

### Generators

Generators are pretty cool. They allow a function to pause and then move on:

![](https://cdn-images-1.medium.com/max/1600/1*Hxw2foasQoQShNvwyd6MyQ.png)
<span class="figcaption_hack">A very simple generator function</span>

It works like this:

* We define the function using `function*`.
* We include one or more `yield` which is where the function will pause.
* Now we store a function call in a variable.
* We can then call `.next()` on that variable to start the function running until
it hits the first `yield`. We call .`next()` again to get to the next `yield`
and so on until we are out of yields.
* Note that in addition to the code we have written, `.next()` also returns an
object with a `done` which is either `true` or `false` and a `value` which is
equal to the return statement from before the yield (I don’t have any up there
so it is `undefined`).

This is handy for things like waiting on network calls. Don’t start the function
again until you have the data you need.

### Miscellaneous

As always, there’s a bunch of stuff that other people probably already know but
I didn’t.

![](https://cdn-images-1.medium.com/max/1200/1*kpdFH0WPJgPdjvGn3kyoHA.png)

* `Object.keys(thing)` returns the keys of an object.
* `Object.values(thing)` returns… you guessed it, the values.

#### Callbacks

I’ve heard the word “callback” a thousand times but I honestly didn’t really
know what it was until I did some research. Here comes
[StackOverflow](https://stackoverflow.com/questions/9596276/how-to-explain-callbacks-in-plain-english-how-are-they-different-from-calling-o),
of course (the second answer is much better than the first):

> A “callback” is any function that is called by another function which takes the
> first function as a parameter.

Well gosh, I know about that! I just wrote [a whole blog post about functional
programming](https://medium.com/craft-academy/functional-programming-in-ruby-for-people-who-dont-know-what-functional-programming-is-f0c4ab7dc68c).

I could rephrase, but honestly the second dude from that SO thread is really,
really great. Read the whole thing and you’ll really understand what a callback
is.

### Stuff Wes covered that I’m not going to talk about

There’s a ton of stuff in the ES6 course. Some of it makes sense to talk about
and give code examples for (you’ve just gone through a ton) and other parts
don’t. Here are things he covers that I’m not going to touch:

* **ESLint** — a linting service for Javascript. One of the coolest things is you
can set it up to run before you make a commit with git. That would get annoying
really fast, but your code would improve.
* **Javascript modules & webpack** — Wes covered lots of stuff about this.
Important if you’re using React (which I will be soon, and I will be blogging a
lot about React). Not going to get into it here.
* **ES6 tooling** — various strategies for running ES6 code in older browsers.
Look at Babel for this.
* **Polyfilling** — providing older browsers with long, complicated methods for
doing things that are butt-easy in ES6 but not supported.
* **Proxies** — overwrite default behavior with handlers and traps. Useful for
sanitizing user input.

### Links and further reading

* [Mozilla docs on template
literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)
* [Mozilla docs on
Sets](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set)
* [DOMPurify](https://github.com/cure53/DOMPurify) — a JS library for sanitizing
user input
* [Getters, Setters and Organizing Responsibility in
Javascript](http://raganwald.com/2015/08/24/ready-get-set-go.html)

And that, friends, is everything I learned from [ES6 for
Everybody](https://es6.io/)!
