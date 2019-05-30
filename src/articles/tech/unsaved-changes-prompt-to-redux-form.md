---
title: "Adding an ‘unsaved changes’ prompt to a Redux form"
draft: false
date: "2017-11-01"
---
Every one of us knows that are users are going to mess up the flows we design
for them. “Click the save button!” we say. They don’t click it. They lose all
their work. Then they get angry. Enter the “are you sure?” prompt. Hideous,
helpful.

### The Setup

I’m adding this prompt in my React project to a Redux Form. We’re already
working with the `reduxForm` HOC (higher-order component) and also the Redux
`connect` component.

### Connecting to the Router

There’s really not much code to add, but it was a pain in the ass to figure it
out. First, implement the HOC. Mine looks like this:

    export default withRouter(
      reduxForm({
        form: 'schoolForm',
        validate
      })
      (connect(mapStateToProps)
        (SchoolForm)
      )
    );

I also had to import the `withRouter` HOC:

    import { withRouter } from 'react-router';

### Adding the before hook

Great, we’re talking to the router. Now we have access to some nifty methods
that help us manage navigation. The one we care about here is
`setRouteLeaveHook`. We’ll add it to the `componentDidMount()` function. Here’s
what my code looks like:

    componentDidMount() {
      const { router } = this.props;
      router.setRouteLeaveHook(router.routes[1], () => {
        if (!this.state.submitted) {
          return 'You have unsaved changes. Exit the page?';
        }
      });
    }

We get the `router` from `withRouter`. The rest of the internet seemed to think
I would have a `this.props.route` which I definitely do not. Instead, I can use
the method inside the router. This worked in two different components and based
on wherever I clicked around, though it seems like it might be problematic to
just take the second element in the `routes` array. Anyway, YMMV.

So we grab the `route` object from the `router`, then we have a function to run
when the user tries to leave the “page”. The `setRouteLeaveHook` function is
clever enough to require of us just a text to give us a yes/no prompt.

![this.props.router.setRouteLeaveHook prompt](https://cdn-images-1.medium.com/max/1600/1*_lU6amwc4s-xL_i0YFF7Bg.png)

### Handling whether or not the form is submitted

For a “regular” form with no monkey business, you can simplify this even further
by using `if (this.props.dirty)` for your conditional on whether or not to show
the prompt. I have some funky file upload stuff going on in this form, so I
needed a little more. The hook will run *after* the form is validated and
submitted, so `this.props.submitted` is always going to be `false`. You have to
use a custom submit function so that you can set `submitted` yourself on state:

    onSubmit = values => {
      this.props.handleSubmit(values);
      this.setState({ submitted: true });
    };

and use it in your form:

    <Form onSubmit={this.onSubmit}>

That’s it! Now you’ll get a yes/no prompt if you try to click away from the form
without submitting it first, even if you have funky upload things or
what-have-you.
