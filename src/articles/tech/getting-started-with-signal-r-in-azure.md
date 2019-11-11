---
title: "Getting started with SignalR in Azure, using Javascript"
draft: false
date: "2019-11-11"
---
The other day, some fine developers at my company were getting ready to roll out a status update page.
We'd tested it extensively but now we were about to put it out at scale.
I was worried about its dependency on an API server that had been acting up recently. We haven't determined the root cause
of our problems on the API side, and this application uses polling - that is, it constantly asks the API for new data.
If that API goes down, it takes our app with it and the increased load from our app might exacerbate the problems we're seeing.

![Tourists in Ireland, perhaps waiting for a message](https://wilkie-portfolio-images.s3.us-east-2.amazonaws.com/travel14.jpg)

One way to step away from polling is to integrate [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr), a persistent connection tool that 
uses websockets and related technologies to allow servers to _push_ updates to clients. The technology is written in .NET
and most of the documentation you will find around the web is using C#. This tutorial will cover a basic Javascript implementation.

# What does it do?
[Open-sourced](https://github.com/aspnet/AspNetCore/tree/master/src/SignalR) SignalR creates a persistent connection between a client and server, using websockets first and then longpolling
and other technologies when websockets are unavailable. Once the client and server have created a connection,
SignalR can be used to "broadcast" messages to the client. When the client receives those messages,
it can perform functions like updating a store.

The most common example given for websockets is a chat app - new data must be shown to the user without
her needing to refresh the page. But if your server gets any updates about changing data that you need to show to a client,
this might be the service for you.

# SignalR on the Azure platform
Perhaps because it was developed by Microsoft, SignalR has a very clean integration on the Azure cloud platform.
Like other function apps, you'll create an "in" trigger and an "out" binding for broadcasting messages.

## Costs
Because I was the first to look at this technology at scale at my company, I had to dig in a little about
costs for this service. Azure charges about $50/month for one "unit" of SignalR service - 1000 simultaneous connections
and one million messages a day. There is also a free service for those playing around or small businesses.
It was really good I dug into those numbers, as you'll see a little below.

## Create a SignalR hub
Let's get started. We'll need a SignalR hub, two function apps, and client code to add to our web app.

Go to SignalR -> Add and fill out your details. It takes a second for the worker to build your service.
Make sure you give the service a decent resource name, as you'll be using it with the rest of your apps.
Also grab Keys -> Connection String for use in our binding.

![Setting up SignalR on Azure](https://wilkie-portfolio-images.s3.us-east-2.amazonaws.com/setting-up-signalr-service.png)

# Create your function app for sending SignalR messages
Because we're working with Azure, we're going to be creating function apps to interface with SignalR.
I wrote a getting-started [blog post](https://wilkie.tech/tech/azure-function-apps-101/) about Azure function apps a little while ago. This tutorial assumes you 
already know how to work with function apps.
Naturally you can work with these libraries without the binding magic, but you'll have to do your own translation of the .NET code!

## The connection app
The first thing we need is a way for clients to request permission to connect to our SignalR service.
The code for this function couldn't be more basic:
```javascript
module.exports = function (context, _req, connectionInfo) {
  context.res = { body: connectionInfo }
  context.done()
}
```
The magic all happens in the bindings, where we pull in our SignalR service. The trigger is an HTTP request
that our client can call.
```javascript
{
  "bindings": [
      {
          "authLevel": "function",
          "type": "httpTrigger",
          "direction": "in",
          "name": "req",
          "methods": ["get"]
      },
      {
          "type": "signalRConnectionInfo",
          "name": "connectionInfo",
          "hubName": "your-signalr-service-name",
          "connectionStringSetting": "connection-string-from-signalr-service",
          "direction": "in"
      }
  ]
}
```

## The client code
To access this method, our client will call:
```javascript
import * as signalR from '@microsoft/signalr'

const { url: connectionUrl, accessToken } = await axios
  .get(url-to-your-connection-app)
  .then(({ data }) => data)
  .catch(console.error)
```
Our function app will return a `url` and `accessToken`, which we can then use to 
connect to our SignalR service. Note that we created the binding with the `hubName` of our SignalR
service - that means you could have multiple connections to different hubs in one client.

# The broadcasting service
Now we are ready to start sending messages. Again we'll start with the function app.
It takes in a trigger and puts out a SignalR message. A trigger could be another using posting a message,
an event from an event hub, or any other trigger Azure supports. I need to trigger off database changes.
```javascript
{
  "bindings": [
      {
          "type": "cosmosDBTrigger",
          "name": "documents",
          "direction": "in",
          [...]
      },
      {
        "type": "signalR",
        "name": "signalRMessages",
        "hubName": "your-signalr-service-name",
        "connectionStringSetting": "connection-string-from-signalr-service",
        "direction": "out"
      }
  ]
}
```
And the code. Again, dead simple.
```javascript
module.exports = async function (context, documents) {
  const messages = documents.map(update => {
    return {
      target: 'statusUpdates',
      arguments: [update]
    }
  })
  context.bindings.signalRMessages = messages
}
```
SignalR messages take, at least, a `target` and `arguments` object.
Once your triggers start firing, that's everything you need to get started with SignalR on the server!
Microsoft has made all of this very easy for us.

## The client code
On the client side, things are a little more complex, but not unmanageable. Here's the rest of the client code:
```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl(connectionUrl, { accessTokenFactory: () => accessToken })
  // .configureLogging(signalR.LogLevel.Trace)
  .withAutomaticReconnect()
  .build()

connection.on('statusUpdates', data => {
  // do something with the data you get from SignalR
})
connection.onclose(function() {
  console.log('signalr disconnected')
})
connection.onreconnecting(err =>
  console.log('err reconnecting  ', err)
)

connection
  .start()
  .then(res => // Potential to do something on initial load)
  .catch(console.error)
```
We consume the `connectionUrl` and `accessToken` we received from the connect function earlier,
then build our connection using those values. We listen to messages with the shared key (for me, it's `statusUpdates`),
and provide handlers for close and reconnecting functions. Finally, we start the connection.
Here we can provide an initial load function. I needed one to fetch initial data to show current status. If you are building a chat app,
you might need to fetch initial messages here.

This is (almost, maybe) everything you need to get started in Javascript with SignalR on Azure!

# Scoping by user
But maybe you, like me, need to send a lot of messages to a lot of users. When I first put this into production, on a sub-set of users,
I was blasting every connection with every single update. Because the client code can scope the messages it listens to,
I used something like `statusUpdates-${userId}` so that the client would only see his own updates. That could work just fine if you have very low volume,
and the more general one is great if everybody in your system needs the same message. But the status I work with is particular to an individual.

![800,000 SignalR messages sent from Azure platform](https://wilkie-portfolio-images.s3.us-east-2.amazonaws.com/800000signalrmessages.png)

Remember how Azure charges per "unit" and each unit has one million messages? I hit that during a few hours of testing
this during a not-busy time. Azure counts each message SignalR has to send as one message. That is, if five connections are hooked up to your hub
and you send ten messages, that counts as 50, not 10. This was a surprise to me, and also required a couple more hours of research.

We can scope our SignalR function code to send only to certain users.
First, we update the connection app to accept `userId` as a query param:
```javascript
      {
          "type": "signalRConnectionInfo",
          "name": "connectionInfo",
          "userId": "{userId}",
          "hubName": "your-signalr-service-name",
          "connectionStringSetting": "connection-string-from-signalr-service",
          "direction": "in"
      }
```
Then we update the broadcasting function to send only to that user:
```javascript
const messages = documents.map(update => {
  return {
    target: 'statusUpdates',
    userId: update.user.id,
    arguments: [update]
  }
})
```
The broadcasting service won't know who has connected, so you'll need to trigger it with
something that has access to a unique ID that the client will also have access to.

The client code simply passes in the userId as a query param:
```javascript
const { url: connectionUrl, accessToken } = await axios
  .get(`${url-to-your-connection-app}&userId=${userId}`)
  .then(({ data }) => data)
  .catch(console.error)
```
I swear to you, the only place on the entire internet I found to let me know how to request a connection
using the `userId` was an answer on [this Stack Overflow question](https://stackoverflow.com/questions/29509396/signalr-client-how-to-set-user-when-start-connection). 
The internet is amazing and Javascript Azure docs are hard to come by.

# Resources
- [SignalR Javascript client docs from Microsoft](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-3.0)
- [Configuring Users and Groups when sending SignalR messages](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/mapping-users-to-connections#IUserIdProvider) - 
examples in C# but you can maybe figure out how the Javascript client is going to behave and take some educated guesses.
- [SignalR Service bindings for Azure Functions](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-functions/functions-bindings-signalr-service.md)
- [Client API](https://github.com/SignalR/SignalR/wiki/SignalR-JS-Client)
- [Working with Groups in SignalR](https://github.com/aspnet/AspNetDocs/blob/master/aspnet/signalr/overview/guide-to-the-api/working-with-groups.md)
- [Tutorial: Azure SignalR Service authentication with Azure Functions](https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-tutorial-authenticate-azure-functions)
