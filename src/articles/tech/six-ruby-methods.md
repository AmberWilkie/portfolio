---
title: "Six Ruby array methods you need to know"
draft: false
date: "2018-02-20"
---
Arrays are one of the fundamental structures of programming. Being able to
quickly manipulate and read data out of them is vital to success in building
stuff with computers. Here are six methods you can’t do without.

![art outside the Oslo train station](https://cdn-images-1.medium.com/max/1600/1*9AjPziZ4KGGEcq52iLMcPA.jpeg)

### Map/Each

These two methods are very similar. They allow you to step through “each” item
in an array and do something to it.

Check out some code:

    array = [1, 2, 3]
    effects = array.each{|x| 
     }

    added = array.map{ |x| x + 2 }

If we read from `added`, we’ll get `[3, 4, 5]`. If we read from `effects`, we’ll
still get `[1, 2, 3]`. Here’s the difference between these two: `.map` will
return a **new** modified array, whereas `.each` will return the original array.

#### Side effects in map

If you’re used to functional programming, Ruby’s `.map` might seem very strange.
Look at this example. I have a simple `Event` class in my project:

    2.3.0 :025 > array = [e, e2, e3]
     => [#<Event id: 1, name: nil>, #<Event id: 2, name: nil">, #<Event id: 3, name: nil>]

    2.3.0 :026 > new_array = array.map{|e| e.name = "a name"; e}
     => [#<Event id: 1, name: "a name">, #<Event id: 2, name: "a name">, #<Event id: 3, name: "a name">]

    2.3.0 :027 > array
     => [#<Event id: 1, name: "a name">, #<Event id: 2, name: "a name">, #<Event id: 3, name: "a name">]

We might expect that we are working with some kind of copy of our records in the
array, but we are not. That is all just to say: be careful. You can easily
create side effects in your `.map` functions.

Ok rest easy, that was the hard one. Smooth sailing from here on out.

### Select

`.select` allows you to “find” an element in an array. You have to give
`.select` a function that returns true or false, so it knows whether or not to
“keep” an array element.

```ruby
2.3.0 :028 > array = ['hello', 'hi', 'goodbye']
2.3.0 :029 > array.select{|word| word.length > 3}
 => ["hello", "goodbye"]
```


A slightly more complex example, probably getting closer to how you’d actually
use this. Let’s throw in `.map` at the end for good measure:

    2.3.0 :030 > valid_colors = ['red', 'green', 'blue']

    2.3.0 :031 > cars = [{type: 'porsche', color: 'red'}, {type: 'mustang', color: 'orange'}, {type: 'prius', color: 'blue'}]

    2.3.0 :032 > cars.select{ |car| valid_colors.include?(car[:color]) }.map{ |car| car[:type]}

    => ["porsche", "prius"]

Yes, folks, you can join these methods to wield unimaginable power. Ok, you can
probably imagine it, but it’s still cool.

#### Even cleaner syntax: .map(&:method)

If we had been working with car objects and not just a simple hash, we could
have used a cleaner syntax. I’ll use a different example for brevity. Maybe we
are preparing this list of cars to send out in an API and need to generate JSON.
We can use the `.to_json` method:

    2.3.0 :047 > cars.select{ |car| valid_colors.include?(car[:color]) }.map{|car| car.to_json}
     => ["{\"type\":\"porsche\",\"color\":\"red\"}", "{\"type\":\"prius\",\"color\":\"blue\"}"]

    2.3.0 :046 > cars.select{|car| valid_colors.include?(car[:color]) }.map(&:to_json)
     => ["{\"type\":\"porsche\",\"color\":\"red\"}", "{\"type\":\"prius\",\"color\":\"blue\"}"]

### Reject

Reject is the yin to `.select`'s yang:

```ruby
2.3.0 :048 > cars.reject{|car| valid_colors.include?(car[:color]) }.map{|car| car[:type]}
 => ["mustang"]
```

Instead of **selecting** for the array items we want, we will **reject**
everything that does not make our function return true. Remember that the
**function inside our reject** is what determines if the array item will be
returned or not — if it’s true, the item is returned, otherwise not.

### Reduce

Reduce has a more complex structure than our other array methods, but it’s
generally used for pretty simple things in Ruby — mostly math stuff. We’ll take
an array, then run a function on every item in that array. This time, we care
about what is being returned from the *other array items*. Typically we are
adding up a bunch of numbers:

    2.3.0 :049 > array = [1, 2, 3]
    2.3.0 :050 > array.reduce{|sum, x| sum + x}
     => 6

Note that we can work with strings in the same way:

    2.3.0 :053 > array = ['amber', 'scott', 'erica']

    2.3.0 :054 > array.reduce{|sum, name| sum + name}
     => "amberscotterica"

This might be helpful if we are looking at a bunch of work records. If we need
to add up total hours worked, or if we want to find out the sum of all donations
last month. One final note about `.reduce. `If you’re working with anything
other than regular old numbers (or strings), you’ll need to include a starting
value as an argument:

    array = [{weekday: 'Monday', pay: 123}, {weekday: 'Tuedsay', pay: 244}]
    array.reduce(0) {|sum, day| sum + day[:pay]}
     => 367
    array.reduce(100) {|sum, day| sum + day[:pay]}
     => 467

There are, of course, more advanced ways to use `.reduce` but this is plenty to
get you started.

### Join

I’m throwing in `.join` as a bonus because it’s so dang useful. Let’s use our
cars again:

    2.3.0 :061 > cars.map{|car| car[:type]}.join(', ')
     => "porsche, mustang, prius"

`.join` is a lot like `.reduce` except it’s got a super-clean syntax. It takes
one argument: a string that will be inserted between all array elements.
`.join`creates one long string out of whatever you give it, even if your array
is a bunch of non-string stuff:

    2.3.0 :062 > cars.join(', ')
     => "{:type=>\"porsche\", :color=>\"red\"}, {:type=>\"mustang\", :color=>\"orange\"}, {:type=>\"prius\", :color=>\"blue\"}"
    2.3.0 :065 > events.join(', ')
     => "#<Event:0x007f9beef84a08>, #<Event:0x007f9bf0165e70>, #<Event:0x007f9beb5b9170>"

### Why not just throw it all together

Let’s use **all** of the array methods in this post together! Ten days of
chores, and it’s random how long each will take. We want to know the total time
we’ll spend on chores. This is assuming we slack off and ignore everything that
takes longer than 15 minutes. Or put off until another day anything that can be
done in less than 5:

    days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    days.map{|day| day.odd? ? 
      {task: 'dishes', minutes: Random.rand(20)} :
      {task: 'sweep', minutes: Random.rand(20)}}
      .select{|task| task[:minutes] < 15}
      .reject{|task| task[:minutes] < 5}
      .reduce(0) {|sum, task| sum + task[:minutes]}

My answer is irrelevant because you’ll get different random minutes for your
tasks to take. If any of this is fresh or confusing, fire up a Ruby console and
give it a whirl.

PS: That `? :` business on `.map` is called a `ternary`. It’s just an if-else
statement. I’m only using it here to be fancy and get everything on “one” line.
You should avoid such a complicated ternary in your own code base.

See you next time!

* [Ruby](https://medium.com/tag/ruby?source=post)
* [Tutorial](https://medium.com/tag/tutorial?source=post)
* [Programming](https://medium.com/tag/programming?source=post)
* [Web Development](https://medium.com/tag/web-development?source=post)
* [Technology](https://medium.com/tag/technology?source=post)

### [Amber Wilkie](https://medium.com/@heyamberwilkie)

Software developer, mostly Ruby and Javascript. Yogi, Traveler, Enthusiast. All
photographs mine. I don’t read the comments — try me on Twitter.

### [freeCodeCamp.org](https://medium.com/free-code-camp?source=footer_card)

Stories worth reading about programming and technology from our open source
community.

Since you included the `&` syntax above, this could also be done similarly:

`array.reduce(&:+)`

Nice, thanks!
