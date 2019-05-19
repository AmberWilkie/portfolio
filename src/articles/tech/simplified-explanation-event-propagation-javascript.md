---
title: A simplified explanation of event propagation in JavaScript.
draft: false
date: "2018-02-18"
---
Imagine this scenario:   
You are building a list of users. You’re displaying their names, favorite colors, and emails. When you click on a user (one row in the table), you want it to take you to the user record. Except for when you click on email, then it should pop up an email dialog.

You might write some code like this (we’re using a table here because it’s easy to understand — though of course we might use something much more complicated in our project):
```html
<Table>  
  <thead>  
  <tr>  
    <th>Name</th>  
    <th>Colors</th>  
    <th>Email</th>  
  </tr>  
  </thead>  
  <tbody>  
  <tr>  
    <td>Susie</td>  
    <td>Blue, Red</td>  
    <td>susie@hello.com</td>  
  </tr>  
  </tbody>  
</Table>
```

If you wanted to click on one of those rows, you’d probably add an `onClick` function to the row. That way if they click anywhere in the row, they can go straight to the user record.

![](https://cdn-images-1.medium.com/max/1600/1*uUr35cH6lVJCFz0J4WKx4Q.png)

To take care of the email, we’ll do an `<a href>` tag on the text.

But wait! The email dialog pops up, but **we also navigate to the user record**. That’s not what we want! How do we handle this? Enter event propagation.

### Event propagation in a nutshell.

Event propagation is a way to describe the “stack” of events that are fired in a web browser. In our table example above, clicking on the `a` tag is the first event that we will fire, but there are other events too.

To understand that concept, you must understand that the elements on a web browser are nested. They do not cover each other up. So a click on the `a` tag also clicks on the row, the table, the `div` in which the table is nested, and anything else all the way out to `document` , the complete container that holds everything in your browser.

If we’ve put any other `onClick` events inside of these other elements, they will also be fired when we click on the `a` link in the table. That’s why we will be directed to the user record when we click on the email link. It’s going to perform both the `onClick` function for the `a` link and the `onClick` function for the row.

#### Bubbles

The movement of events “up” from the most-nested element ( `a`) out to the least-nested ( `document`) is referred to as “bubbling.” If events start in the “outer-most” element and moved “down,” that is referred to as “trickling.” All you probably care about is the default behavior: bubbling.

### How to use event propagation to your advantage

Honestly, I hadn’t run into **any** use-case for caring about event propagation until this week, when I needed to build a table with a checkbox in it. Unfortunately for me, when I tried to set up the checking functionality, it took me to the record. Fortunately, I did some training earlier (see references below) that gave me a clue on exactly what I had to Google.

You probably already know that when you create an `onClick` event, it is passed to whatever function you call.

So here, I was able to write:
```javascript
handleCheck = e => {  
  e.stopPropagation()  
  // talk to my API, set the record as "done" or not  
}

<span onClick={this.handleCheck}>[]</span>
```

That `e.stopPropagation()` halts this “bubbling” of events “up” through the DOM. We stop all of the other events in the stack. Awesome!

So my whole row gets to behave as it should, and this one little checkbox can have a special functionality.

#### `preventDefault` vs. `stopPropagation`

You may be thinking: why not just use `e.preventDefault()`? That is indeed the first thing I tried, but there simply is no default behavior for a span (unlike a form, whose default submit behavior will refresh the page).

### Cut-and-paste example

I write a lot of React, so I’m giving an example in React. But this would work the same in plain old HTML and JavaScript, using whatever method you’ve got to add event listeners:
```javascript
<div onClick={() => console.log('outer div')}>  
  <div onClick={() => console.log('middle div')}>  
    <div onClick={() => console.log('innermost div')}>  
      Click me!  
    </div>  
  </div>  
</div>
```

Event propagation: bubbles without the champagne.

![Console log for event propagation example](https://cdn-images-1.medium.com/max/1600/1*n0bCv9N8hI4ZyHN5zCLnnA.png)

### References

*   Big shouts to [Wes Bos](https://medium.com/@wesbos) who first introduced me to this concept in his #Javascript30 [course](http://javascript30.com). I would have had no idea what to Google when I ran into the problem identified in the table example above if I hadn’t first seen it during the course.
*   [This Stack Overflow answer](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing), which nicely sums up some of the more nuanced bits of event capture and propagation.
