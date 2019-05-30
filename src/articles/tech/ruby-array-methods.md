---
title: "Ruby array methods: .flat_map, .values and .keys"
draft: false
date: "2017-10-04"
---
I’m a new developer, so nearly every day I come across something I didn’t know
existed — some trick that can turn ten lines of code into two or I unlock what
feels like a “secret” and enables me to move on. I made a list of then then the
first one went long so let’s break it up.

![Bivalve action in Ireland is totally related to Ruby array methods](https://cdn-images-1.medium.com/max/2600/1*w2bQZ2J3_NtKhfzIzcznqQ.jpeg)

### .values and .keys

Say you are getting a bunch of data from a server or client — JSON objects,
likely. If you had the most basic service ever, it might look something like
this when you’ve done parsing it:

    [
      {"id"=>"1"}, {"_id"=>"2"}, {"person_id"=>"3"}
    ]

Because other people wrote this code, it’s not formatted very well. Here we
side-step to get our bonus methods, `.values` and `.keys`. Check it:

    [27] pry(main)> arr.map{ |item| item.values }
    => [["1"], ["2"], ["3"]]

We get our values! But they’re inside of arrays, bummer. (We’ll fix it in a
sec.)

    [29] pry(main)> arr.map{ |item| item.keys }
    => [["id"], ["_id"], ["person_id"]]

And there are those crappy, worthless keys. Also sub-arrayed.

### .flatten

So how do we break those out? You probably are already familiar with `.flatten`:

    [30] pry(main)> arr.map{ |item| item.values }.flatten
    => ["1", "2", "3"]

But that can look really ugly if we have a long `map` function going on using
`do` and `end`. Ever seen `end.flatten` in a code base? I hadn’t until I wrote
it…

### .flat_map

Then in code review, I learned about `flat_map`:

    [31] pry(main)> arr.flat_map{ |item| item.values }
    => ["1", "2", "3"]

Nice! And according to the interwebs, it’s more than twice as fast as
`.map.flatten`. Bonus.

Coming up: benchmarking, and lots more array methods
