---
title: "How to build a smart button using React"
draft: false
date: "2018-03-22"
---
This is a tale of three buttons and how a web developer who leans away from
design made her front-end dreams come true.

![Button transitions only a web developer would be proud of.](https://media.giphy.com/media/cOhfv5Fh9KOd3CDE1d/giphy.gif)

You should know ahead of time that most of the styling here is boilerplate
[Bootstrap](https://getbootstrap.com/). It looks good and it’s an
internal-facing product, so we don’t fix something that’s not broken.

Our task was to create an easy-to-understand interface to deal with a record.
Our record has a three-part`state` — either `available`, `sick` or `vab`. Not a
lot of state to communicate once, but we need five weeks’ worth of these on a
page.

Side note: “VAB” is a Swedish word that refers to staying home with your sick
kid. There’s a difference between doing that and being sick yourself here, both
in pay and in time off!

### Checking for an existing record

The first step was showing whether or not the user had a record for the day in
question. As in every React project I know, we were taking a list from an API
(our own) and iterating over it. Since the API will return a list of existing
records and ignore days without records, we’ll need to set up our own array of
days.

Here’s our code for getting five weeks’ worth of days:

    export const dateArray = (numberOfDays, startDate) => {
      const day = moment(startDate);
      const days = [];
      while (days.length < numberOfDays) {
        if (day.day() === 6 || day.day() === 0) {
          day.add(1, 'days');
        } else {
          days.push(day.format('YYYY-MM-DD'));
        }
        day.add(1, 'days');
      }
      return days;
    };

I’ve written about [Moment.js](https://momentjs.com/) before. If you’re not
using it, get on the darn bandwagon already! It makes working with dates
stupid-easy, like here where we can call `day.add(1, 'days')` or where we get
the day of the week with `moment(startDate).day()`.

Moment objects are mutable! So be careful generally, but here it’s great because
we need to update our `day` and we can do so with very little code.

Side note: Americans would naturally make Saturday the last day of the week — 6
— and Sunday the first day — 0. But not Swedes or basically the rest of the
world. To almost everyone not American, the week starts on Monday. Programming
can be very weirdly America-centric.

Here you can see we’re assembling a list of dates, starting with `startDate`,
and we keep going until we reach `numberOfDays`, skipping weekends. We’ll use
this array to build our record list so we can put some yummy buttons on it.

#### Mapping our days array to reflect actual records

Now that we have all of the days we need to show (below we call `dateArray`),
we’ll have to loop over our data set from the API to figure out whether or not
we should show a record. Because we want to see dates that do not have records,
we must set up an array with some filled and some empty records:

    const userRecords = dateArray(50, startDay).map(date => {
      const recordToReturn = data.find(record =>
        record.date === date
      );
      return { date, record: recordToReturn };
    });

Now we have an array of dates, some with a full record and others with `record:
undefined`.

### Available Button logic

Now that we can see if there is a record on that day or not, we can condition
our button to show green and say “Available” or white and “Add.” Again, I’m
using Reactstrap for basic styling. The `Button` component comes with some nice
spacing and rounded corners and whatnot, plus handy “color” params that I can
set to things like “info” and “success.”

    <Button color={setColor(record)} >
      {this.state.buttonText}
    </Button>

#### Setting the button text

To set the `buttonText`, I’ll check whether there’s a record:

    const buttonText = () => 
      isEmpty(this.props.data.record) ? 'Add' : 'Available'

Remember that I’m passing `{date: 'some date', record: {some: 'record'}}` into
each of my button components. If my `userRecords` didn’t find a record for that
day, we’ll have nothing in `data.record` and we can say “Add.” `isEmpty` comes
from the excellent Javascript library [lodash](https://lodash.com/). Once again,
get on the bandwagon. Lodash makes Javascript so much cleaner and easier to work
with.

#### Setting the button color

Our `setColor` function will also check if the record exists, but it will
further have to look at the `state` of the record to see what color we need to
display.

    const setColor = () => {
      if (existingRecord && record.status === 'available') {
        return 'success';
      } else if (existingRecord)) {
        return 'gray';
      } else {
        return 'secondary';
      }
    };

Bootstrap defaults pleasantness. We’ve overwritten these default words with our
own colors, but the out-of-the-box options are also nice. Here we check if the
record is `available`. If it’s not available but there’s still a record, it must
be `sick` or `vab`, but in either case, the user is no longer `available` on
that day, so we’ll have to gray out the button.

![Colored buttons demonstrate four statuses.](https://cdn-images-1.medium.com/max/1600/1*J73Qzjq_mkMta6f8QMKiPQ.png)

### The other two buttons

I can use React’s super-handy conditional display to hide the “sick” and “vab”
buttons when there is no record. Here’s the code for the remaining two buttons:

    {existingRecord && (
      <div>
        <Button
          color={setSecondaryColor(record, 'sick')}
          style={{ marginRight: '5px' }}
        >
          Sick
        </Button>
        <Button
          color={setSecondaryColor(record, 'vab')}
          style={{ marginRight: '5px' }}
        >
          VAB
        </Button>
      </div>
    )}

To make sure our buttons are getting the right colors, we’ll just check that the
`record` has `status` “sick” or “vab,” respectively. If the record’s status does
not match the button’s, we’ll make sure it is not colored (our “secondary”
button color is white).

    const setSecondaryColor = (record, status) => {
      if (record.status !== status) { return 'secondary'}
      if (status === 'sick') { return 'danger'}
      if (status === 'vab') { return 'yellow'}
    }

### Getting fancy with rollovers

At this point, the buttons did everything I needed them to do (plus all of the
API request logic I’m omitting from this post — we are creating and updating
records with these buttons).

But how can a girl be satisfied with her buttons if there are no rollover
effects? We need to be able to remove a record for a day somehow. Instead of
making an X and having our users click that, wouldn’t it be better if they could
click one of the existing buttons to remove the record? I thought so.

I added a `onMouseOver` and `onMouseOut` events to my “Available” / “Add”
button:

    const mouseOver = () => {
      if (existingRecord) {
        this.setState({ buttonText: 'Remove' });
      }
    };
    const mouseOut = () => this.setState({ buttonText: buttonText() });

Now when you mouseover the button, it will change to “Remove” if a record exists
(and otherwise stay the same). When you mouse out, it will go back to saying
“Available.” So pretty, so functional!

<span class="figcaption_hack">Mouseover demonstration of button functionality</span>

I was surprised by how much thought and effort had to go into something
relatively simple. Getting buttons to be the right color, have the right text
and do the right things is more complex than it might seem. In fact, I’ve showed
these buttons to people like my husband, who just shrug. It’s a fact of life: no
one is going to like your buttons as much as you do.
