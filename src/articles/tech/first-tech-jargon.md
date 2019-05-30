---
title: "Overloaded Operators, Linked Lists and more"
subtitle: "Tech Jargon Series"
draft: false
date: "2017-05-20"
---
Yesterday, I was at the [Got Lambda](https://www.meetup.com/got-lambda/) meetup
here in Gothenburg. The speaker was going over a functional programming
framework, walking us through some of the main features and giving code
examples. At some point, I just started writing down a bunch of concepts he was
throwing out like everyone would understand. Maybe everyone else *did*
understand. But I figured I ought to figure this stuff out, then maybe the
meetups will be more interesting. And if I’m going to figure something out, I
might as well write about it. Thus, this post.

I’ve heard all these things before, but I still don’t know what the deal is.
Maybe you’re in the same boat.

### Overloaded Operators

The general idea here is that you have an operator (`+ — / *`) that can work in
more than one way.`3 + 3` is not the same as `3.0 + 3.0` but you can use the
same operator (`+`) because that is an overloaded operator. One adds integers,
the other floats — the way the operator works changes based on the arguments.
The first one returns an integer (`6`), the second a float (`6.0`).

I thought this one would be an easy google, but it wasn’t until [this SO
question](https://stackoverflow.com/questions/3331962/list-of-ruby-operators-that-can-be-overridden-implemented)
that I understood that while they are saying “overloaded” what they mean is
“overridden”. [This
link](https://www.tutorialspoint.com/cplusplus/cpp_overloading.htm) is also
helpful, but discusses C++.

### Linked Lists

I know from my brief work with
[algorithms](https://medium.com/craft-academy/introduction-to-algorithms-chapter-two-part-one-fe76fe513024)
that this is a rather large topic, but I wanted a general overview of what this
means. At the meetup, the speaker was saying that the arrays were all linked
lists. What?

Sometimes Wikipedia gives overly technical answers to my programming questions,
but [this one was actually very
helpful](https://en.wikipedia.org/wiki/Linked_list). A linked list is a
collection of nodes. Each node consists of a piece of data and a pointer (a
“link”) to the next node. As the article explains, one of the main benefits of
linked lists is that items can be inserted or removed without needing to
reconfigure the entire structure — simply update the pointers for the affected
nodes.

Arrays in Ruby have indices and those serve as our “pointers”. If you want to
know what is stored in the 3rd item in array, you’ll need to use the 4th index.
If you delete the first item, that changes the index of that item. In linked
lists, no such rearrangement is necessary: the “index” of items does not change.

### Tuples

A tuple (pronounced TUH-pull) is just like an array, but it cannot be changed
(it is immutable). Confusingly, they are synonymous with “records” in some
languages.

I found this [gem that allows you to use
tuples](https://github.com/KamilLelonek/ruby-tuples) in Ruby, but otherwise I
don’t think it’s a common or popular thing to do in the language.

### Currying

Currying is a functional programming thing that breaks up a function that takes
multiple arguments. You then deal with them separately as functions within a
function that each take one argument. [This
tutorial](https://www.sitepoint.com/functional-programming-techniques-with-ruby-part-ii/)
has a great example on currying in Ruby and [this
one](http://onoffswitch.net/leveraging-message-passing-currying-ruby/) is very
helpful for understanding the concepts. I’m using the second as base for an
example:

    def sentence(string1, string2)
     string2 + ' ' + string1
    end

    def addDude
     appendText = lambda do |fn, string1, string2|
       send(fn, string1, string2)
     end

     appendText.curry.(:sentence, 'dude')
    end

There’s some next syntax here for the uninitiated (as I was). `send` is passing
on a “message” of sorts — about the arguments and the function to be called. It
is going to pass `dude` down the line into the curried function. `curry` and the
`.(:` notation allows for “auto-currying”. We call it with `addDude.('yo')` and
get `'yo dude'` in return. We are skipping over the `addDude` function and
passing that variable into the `appendText` curry construction.

![Currying in Ruby](https://cdn-images-1.medium.com/max/1600/1*uL1tm3kYMWKD9dVkFbEecw.png)

So why would anyone do this? It allows for reuse of functions. So above we are
passing a function into `appendText.curry.(:function, argument)` that could be
reused to do all manner of thing to our argument. It allows our code to be dry
and allows our functions to be “pure” (produce the same output for the same
input). [This article](https://hughfdjackson.com/javascript/why-curry-helps/)
was helping for more of the “why” behind this method.

PS: While figuring this one out, I came across that `string1 * 2` is “yoyo” but
`2 * string1` throws an error (`String can't be coerced into Fixnum`). Fun!

Ok, that’s it for today! I’ll be back at you with more crazy concepts after
future head-scratching at tech meetups.
