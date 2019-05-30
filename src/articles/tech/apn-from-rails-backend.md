---
title: "Apple Push Notification Service from a Rails back-end"
subtitle: "Token-based authentication to the APN server"
draft: false
date: "2017-06-20"
---
Turns out, push notifications are one of those things that you will spend three
days googling and trying every combination of thing you can think of, and
hitting wall after wall after wall. Here’s how we did it.

### First, get your Apple permissions in order

We’re building version 2.0 of our app, so we already had push notifications
working from a Node server. This was helpful but not as much as you’d think! The
internets are full of step-by-step instructions for how to do this, but in
short, you’ll need to:

* Set up your Apple developer account
* Grant push notification permissions for your app
* Obtain a .p8 file (a certificate that contains a private key so Apple can decode
your messages)

You’ll need [these
docs](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html),
likely.

### Construct your token

Here’s the tricky part, though of course once we figured it out, it didn’t seem
so tricky. The answer always seems obvious once you have it.

The APN server expects your message to come in two pieces: a header that
contains:

    {
      "alg": "ES256",
      "kid": "ABC123DEFG"
    }

and a claim / body / payload that contains:

    {
      "iss": "DEF123GHIJ",
      "iat": 1437179036
    }

Why all the slashes? Because this second piece of the message is referred to as
all three at various point in Apple documentation and in various places around
the ‘nets. As far as I know we can treat them interchangeably.

#### Where to get those numbers

The `"alg"` needs to be `"ES256"` and we’ll do the `"iat"` in a second, but the
other two numbers come from your Apple developer account:

* Your key ID (`"kid"`) is the authentication key for your app. You can find it
under Certificates, Identifiers & Profiles > Keys.
* Your team ID (`"iss"`) can be found in the URL when you visit your developer
account page. It can also be found on your “membership” page.

### Sign your token

For this, we’ll need a library for encoding and decoding tokens. We used
[JWT](https://github.com/jwt/ruby-jwt).

First, you’ll have to configure your .p8 private key (which you obtained from
Apple) so we can use it here. We will refactor this later, but for now, you can
just drop the text of the p8 file into a variable, then use it to set up your
private key:

    private_key = OpenSSL::PKey::EC.new p8key

This constructs a `private_key` in the right format for JWT.

Now we can build our encoded token:

    token = JWT.encode(
      { 
        'iss': TEAM_ID, 
        'iat': DateTime.now().to_time.to_i 
      }, 
      private_key, 
      'ES256', 
      header_fields= 
        { 
          'alg': ALGORITHM, 
          'kid': APNS_KEY_ID 
        }
    )

We were stuck on this so long. You need to build your token for JWT *in this
order* and with a key-value pair for `header_fields` (but not the other
arguments). It works so just go with it. I also, with much pain, discovered that
you cannot replace that `=` in after `header_fields` with a `:` — it will throw
`InvalidProviderToken` messages from the server and you will want to die.

You’ll also note that we are dynamically-assigning the `iat` — which is the
“issued-at time”. APNs needs to know when the token was created — this is the
proper format to tell it. You’ll need to regenerate a token every hour.

#### Final check on that token

Because this part has been such a bitch, here’s a final check. You can try
decoding it manually and it should look like this:

    irb(main):069:0> JWT.decode(token, private_key)
    => [{"iss"=>"TEAM_ID", "iat"=>1498818237}, {"typ"=>"JWT", "alg"=>"ES256", "kid"=>"APNS_KEY_ID"}]

If it doesn’t look like that, you’ve done it wrong and APNs will reject with
`InvalidProviderToken`.

### Set up the client

The [Net-Http2](https://github.com/ostinelli/net-http2) gem works great for
this. Here’s the code:

    client = NetHttp2::Client.new("https://api.development.push.apple.com:443")

    client.on(:error) { |exception| puts "Exception has been raised: #{exception}" }

We’re creating a client that opens a socket to speak with APNs. We’re also
creating a little error handler that lets us know if something goes wrong.

This connection will be open seemingly indefinitely — but certainly for a very
long time. You can inspect it to check if it is still connected.

Also note that there are two URLs that Apple uses to send push notifications — a
production and a development one. Your server knows what environment your device
is registering in. If you are getting `BadDeviceToken` and you know that is the
right token for your device, maybe you are sending the request to the wrong
environment.

### Make the request

Ok, we’re ready to send a push notification!

#### Build your body object

I can’t tell you how much of a blocker this was for such a long time. If you
write `body: 'hello!'` Apple will send you a 200 response. Good job, you! Not.
Here’s how you need to format the body of your request:

    body = { aps:
      { alert: 'awesomesauce!' }
    }.to_json

One last item to grab from Apple: the “topic” for your app. This is found in
your developer account under “App IDs” — it looks like a URL. We’ll use the
token we built in the last step for authentication.

    request = client.call(
      :post,
      '/3/device/DEVICE_TOKEN', 
      body: body, 
      headers: 
        { 
          'authorization' => "bearer #{token}", 
          "apns-topic" => "YOUR_APPLE_TOPIC" 
        }
    )

Now the server returns a 200 status… it should be working:

    => #<NetHttp2::Response:0x007fe502e91d78 
    ="", 
    ={":status"=>"200", "apns-id"=>"3786DB61-7319-99F9-E45D-ACD2B9E32D0C"}>

APNs has a bunch of error codes so you can trouble-shoot what’s going on —
things like expired provider tokens and bad device tokens. If you’re getting one
of those, you’re actually in luck: something you can troubleshoot! It may be
more likely that you get a 200 but your app displays no response. We dealt with
that for ages before finally getting the body formatting right.

#### Receiving the push notification in a React Native app

I’ve barely touched our React Native app, so I can only provide the tiniest
amount of help here. By the time we started messing with it, most of this had
already been done. Jump over to this tutorial and follow along:

### The final jab of pain

After all of this — finally getting it to work great locally, we uploaded it to
our staging server on Heroku. Fail fail fail. After a few hours of poking at it,
I realized that locally I was running OpenSSL 1.0.2 (note how we use it for
token encryption above) but our Heroku stack was running 1.0.1. Pain, pain in my
heart!

I spent the greater part of two days trying to massage 1.0.1 into working the
same way as 1.0.2 and ultimately getting Apple to accept my encryption. Nothing,
and eventually we upgraded our Heroku stack. I ended up being on vacation at the
time, so the glorious moment when it actually started working belonged to
others, but I imagine a lot of sighs of relief.

Thanks for reading along. Hopefully this was helpful for someone!
