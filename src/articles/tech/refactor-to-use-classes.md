---
title: "JavaScript code cleanup: how you can refactor to use Classes"
draft: false
date: "2018-06-18"
---
In smaller React projects, keeping all of your component methods in the
components themselves works well. In medium-sized projects, you may find
yourself wishing you could get those methods out of your components and into a
“helper”. Here, I’ll show you how to use a Class (instead of exporting
individual functions and variables) to organize your code.

**Note**: I work in React so that’s the example we’ll discuss here.

### Typical refactor

In a typical refactor, you’d take a function on the component and move it to
another helper.

From:

    const MyComponent = () => {
      const someFunction = () => 'Hey, I am text'

      return (
        <div>
          {someFunction()}
        </div>
      )

To:


and

    export const
    someFunction = () => 'Hey, I am text'

This example is really silly, but you see where we’re going:

1.  Take your functions and copy them over to a separate file
1.  Import them and call them as normal.

When things get complicated, though, you’ll have to pass in a bunch of stuff to
those functions — objects, functions for manipulating state, and so on. Today I
ran into a problem where I wanted to extract three functions out of a component
and they all required the same inputs (a `resource` and a function to update the
`resource`). There’s got to be a better way…

### Refactoring with a class

I made a big demo for this post. You can see the code [on
Github](https://github.com/AmberWilkie/class-demo). The initial commit shows all
of the functionality inside the main component (`App.js`) and the subsequent
commits refactor the code to use a class.

![React class demo image](https://cdn-images-1.medium.com/max/2600/1*2Dj3heIrZkJLPmYdtkHICg.png)

You can run this yourself and do whatever you want to it. Remember to `yarn
install`.

We start with a component that “fetches” an object (mimicking the way we might
do this from an API) with certain attributes on it: repeat (number of boxes),
side (height and width), text, color. We then have a number of ways we
manipulate the view — changing the color, updating the text, and so on. After
each change, we display a message.

For instance, here’s our change width and height method:

    changeSide = side => {
      const obj = {...this.state.obj, side}
      this.fetchObject(obj);
      this.setState({ message: `You changed the sides to ${side} pixels!` });
    }

We might have a number of other methods that require similar actions — or
perhaps very different methods. We might start thinking about extracting this
code to a helper. Then we would create a different method to call the `setState`
action and we’d have to pass it, `this.fetchObject`, the object in state, and
the `side` we are getting as an argument to the method. If we have several
similar methods, that’s a whole lot of passing parameters and maybe it’s not
actually that helpful (or readable).

Instead we can use a class, complete with a constructor method:

    export default class ObjectManipulator {
      constructor( { object, fetchObject, markResettable, updateMessage, updateStateValue } ) {
        this.fetchObject = fetchObject;
        this.markResettable = markResettable;
        this.updateMessage = updateMessage;
        this.updateStateValue = updateStateValue;
      }
      changeSide = ( object, side ) => {
        const newObject = { ...object, side };
        this.fetchObject(newObject);
        this.updateMessage(`You changed the sides to ${side} pixels!`);
        this.markResettable();
        this.updateStateValue('side', side);
      };
    };

This allows us to create an object whose functions we may call inside of our
main component:

    const manipulator = new ObjectManipulator({
      object,
      fetchObject: this.fetchObject,
      markResettable: this.markResettable,
      updateMessage: this.updateMessage,
      updateStateValue: this.updateStateValue,
    });

This creates an object `manipulator` — an instance of our `ObjectManipulator`
class. When we call `manipulator``.changeSide(object, '800')` it will run the
`changeSide` method we define above. There’s no need to pass in `updateMessage`
or any of the other methods — we pick them up from the constructor, when we
created the instance.

You can imagine that this becomes really useful if we have a lot of these
methods to deal with. In my case, I needed to call `.then(res =>
myFunction(res)` after everything I was trying to extract. Defining `myFunction`
on the class instance instead of passing it to each function saved me a lot of
code.

### Keeping everything organized

This method of organization can be really helpful to keep everything in its
place. For instance, I have an array of colors that I map over to get the color
buttons you see in the example. By moving this constant into the
`ObjectManipulator`, I can make sure it doesn’t clash with any other `colors` in
the rest of my app:

    ObjectManipulator {
      [...]
      colors = ['blue', 'red', 'orange', 'aquamarine', 'green', 'gray', 'magenta'];
    };

I can use `manipulator.colors` to grab the right colors for this page, whereas
there might be aglobal `colors` constant that is used for something else.

### References

[Good old Mozilla Class
docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
