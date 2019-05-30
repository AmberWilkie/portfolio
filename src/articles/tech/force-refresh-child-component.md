---
title: "How to force-refresh a React child component: the easy way"
draft: false
date: "2018-04-19"
---
**Note: As of React 16, **`componentWillReceiveProps()`** is deprecated, meaning
if you are using that version or higher in your project, this is not good advice
for you.**

![the dark hedges in Northern Ireland](https://cdn-images-1.medium.com/max/2400/1*5GipOUpmtMBQf3pOTcJ1YQ.jpeg)

In the React world, forcing a re-render is frownedupon. You should let the DOM
take care of itself when React perceives changes to `state` or `props`. In order
to follow these patterns, we sometimes have to do stuff that seems a little
silly. Considerthis scenario:

![Silly simple example of a child component who manages their own state](https://cdn-images-1.medium.com/max/1600/1*4y0iCPmTIuOufQgg4YsRig.png)

We’ve got two components — a parent and a child. The parent makes an API call
tofetch the `user`. From that, we get things like `name`, `age`, `favorite
color`. Wealso get an `id` from our database. We’ll pass that to our child
component, which is also going to make an API call, with the user id. Awesome —
lots of data coming into our app.

Let’s say we are storing a list of shoes in the database. When the user changes
their color preference, the server writes new data to the user’s shoe list.
Great! Except, we aren’t seeing the new shoe list in our child component. What
gives?

**Side note**: Of course we should just get the shoes from the call for the user
— this is just a simplified explanation.

### React rerendering basics

Theshort of it is that React will only update parts of the DOM that have
changed. In this case, the `props` we pass to the shoe component ( `userId`)
haven’t changed, so nothing changes in our child component.

The color preference for the user will update when we get back new information
from the API — assuming we are doing something with the response after we update
a user.

But as React sees no reason to update the shoe list, it won’t — even though on
our server, the shoes are now different.

### The starting code
```javascript
const UserShow extends Component {
  state = {
    user: {}
  }
  
  componentDidMount() {
    this.fetchUser().then(this.refreshUser)
  }
  
  setNewColor = color => {
    this.updateUser({color}).then(this.refreshUser)
  }
  
  refreshUser = res => this.setState({user: res.data.user})
  
  render() {
    const { user } = this.state;
    
    return (
      <div>
        User name: {user.name}
        Pick color: 
        <div>
          {colors.map(color => 
            <div className={color} 
                 onClick={() => this.setNewColor(color)} />)}
          )}
        </div>
        <ShoeList id={user.id} />
      </div>
    )
  }
}
```

Our `ShoeList` is just going to be a list of shoes, which we’ll fetch from the
server with the user’s id:

```javascript
const ShoeList extends Component {
  state = {
    shoes: []
  }
  
  componentDidMount() {
    this.fetchShoes(this.props.id)
        .then(this.refreshShoeList)
  }

  refreshShoeList = res => this.setState({ shoes: res.data.shoes })
  
  render() {
    // some list of shoes
  }
}
```

If we want the shoe component to grab the new list of shoes, we need to update
the props we send to it. Otherwise it will see no need to refresh.

In fact, the way this is written, the `ShoeList` would never refresh, as we are
not dependent on props for rendering. Let’s fix that.

### Triggering a child component to re-render

To force the child component to re-render — and make a new API call — we’ll need
to pass a prop that will change if the user’s color preference has changed.

To do this, we’ll add a method into `setNewColor`:

```javascript
[...]

setNewColor = color => {
  this.updateUser({color}).then(res => {
    this.refreshUser(res);
    this.refreshShoeList();
  })
}

refreshShoeList = () => 
  this.setState({refreshShoeList: !this.state.refreshShoeList})

[...]

<ShoeList id={user.id} refresh={refreshShoeList} />
```

This is a simple switch we can flip. I’ve kept things as simple as possible, but
in production we’d want to make sure that the color we’re setting is different
than the color we had before. Otherwise, there will be nothing to update.

Now in the `ShoeList`:

```javascript
componentWillReceiveProps(props) {
  const { refresh, id } = this.props;
  if (props.refresh !== refresh) {
    this.fetchShoes(id)
      .then(this.refreshShoeList)
  }
}
```

If you pass only `refreshShoeList` and then toggle based on that boolean, the
component will just update forever and ever and ever.

We need to make sure the switch has flipped only once — so we’ll just check that
the props coming in are different than the props we had before. If they are
different, we’ll make a new API call to get the new list of shoes.

And boom — our child component has been “forced” to update.

#### componentWillReceiveProps

It’s worth taking just one more minute to review what’s going on in that last
piece of code. In `componentWillReceiveProps` we have our only opportunity to
view new props as they are comingin and compare them with previous props.

Here we can detect changes (like in `refresh`) and we can also make checks for
new props (note, for instance, that `refresh` is initially `undefined`).

This React method is a very powerful way to manipulate and examine `props`.
