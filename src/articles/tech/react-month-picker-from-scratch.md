---
title: "React month picker from scratch"
draft: false
date: "2017-11-27"
---
There’s something satisfying about rolling your own when you thought you’d need
a library — you expect to build on someone else’s work but then realize you’ve
got everything you need already. I ran into this recently when we wanted to way
simplify our date-picker and allow users to simply scroll through months.

### What we need

![month picker example](https://cdn-images-1.medium.com/max/1200/1*3RGwsYlXeAwxNnRWzJizSA.png)

What we actually need is really simple: a display of the month, and a way to
advance and retreat through the month to either side. Here’s what this thing
looks like — nothing even remotely special (and not even chevrons for arrows —
those are just < and >). Our UX person will undoubtedly make this stay in place
when we have characters that move the spans around. In the meantime, it works
and that makes me happy!

### Moment and our JSX

First up: to start with, we need today. So we fire up `moment` in our `state`.
If you’re not using `moment`, then I don’t even know what to do with you because
it’s absolutely essential to my codebase.

    state = {
      month: moment(),
    }

And we’ll need somewhere to stick our date. Here’s our JSX:

    <h2>
      <span onClick={this._decreaseMonth}>{'< '}</span>
      <span>{this.state.month.format('MMM YYYY')}</span>
      <span onClick={this._increaseMonth}>
        {this.state.month.clone().add(1, 'hour') > moment() ? '' : ' >'}
      </span>
    </h2>

We’ve stuck our `_increaseMonth()` and `_decreaseMonth()` on our < and >,
respectively.

For the `_decreaseMonth()` we only want to show the > if the next month is less
than now. Note that `moment()` creates a **mutable object** so if you call
`add(1, 'hour')` on it, you’ll find your `moment()` has increased an hour
everywhere. Not good! So we just throw a `clone()` in there and our original
`moment` object is untouched.

Finally, we need to display the current month. We use `moment`'s handy
`.format()` to show just the month and year.

### Increment and decrement month

Yeah, I realize writing this I should have used increment and decrement instead
of increase and decrease. Meh.

Here we are:

    _decreaseMonth = () =>
      this.setState(
        prevState => ({ month: prevState.month.subtract(1, 'month') }),
        this._filterByMonth
      )

You’re starting to really dig `moment`, right? If we’ve clicked that <, we’ll
subtract a month from the moment hanging out in our state. Now the
`this.state.moment` will be a date in October. Rock.

Likewise, if we want to move up a month:

    _increaseMonth = () =>
      this.setState(prevState => ({ month: prevState.month.add(1, 'month') }), this._filterByMonth)

### Filter By Month

This is basic React stuff, but that function `this._filterByMonth` we’ve got
after the `setState` function means it will run *after* state is set. This is
important because we need the new state to make an API call. At this point, if
you grabbed all of this code and stuck it in your own project, you could do
literally anything you wanted with that date object. I need to make a new API
call to search by dates.

There’s a little more here ( `_runFilter` ) with our API call that you don’t
need to care about.

    _filterByMonth = () => {
      const month = this.state.month.clone()
      this._runFilter({
        minDate: month.startOf('month').format(),
        maxDate: month.endOf('month').format(),
      })
    }

We need to clone `this.state.month` because it’s a `moment` object and remember
that it is mutable. Otherwise we’d be changing the object and it would jump all
over the place. But here, we clone it, then we can grab the beginning of the
month, then the end of the month, then not care at all what is going on with
that cloned object. And boom! Now we’re calling the API with the first and last
of the month in question.

Very little code and far more satisfying than bringing in a whole library.
Roll-your-own FTW.
