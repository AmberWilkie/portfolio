---
title: "Amazon Web Services S3 storage: Rails and React"
subtitle: "Direct upload from the client, pre-signed URL from the server, plus stubbing calls!"
draft: false
date: "2017-08-23"
---
Over the last weeks, we’ve worked with Amazon Web Services’ S3 to build two
separate functionalities for our server and applications: user upload of profile
images and storage of some internal information that we regularly generate.

![sand dunes near Merzouga, Morocco](https://cdn-images-1.medium.com/max/2600/1*m6-EsuO0shosdsE-Lp7dNg.jpeg)

While I drew extensively on the internet to help solve these problems, not all
of this was explained in one spot, so I thought I would. Here we go.

### Setting up AWS

First thing, you’ll need an AWS login. We already had one for our organization
but it’s not hard to do if you are new to the system. Next, you’ll have to
create a bucket, which is Amazon’s fancy word for “folder”. Now grab your
credentials. You need:

* AWS access key ID
* AWS secret access key
* AWS region

More info on how to get those is
[here](http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html).
For now, just go ahead and **dump them in your **`.env`** file**.

### The easy bit: Direct upload to S3

We’ve got access — let’s send something to our bucket. The first feature we
needed was the easiest to implement. We wanted to siphon off some information
from our records and store it in our bucket.

#### Preparing the data

Once the data is ready (as JSON), we write it to a file and get it ready to
send:

    def
    prepare_file(
    )
      start_date = 2.months.ago.strftime("%Y%m%d")
      end_date = 3.months.ago.strftime("%Y%m%d")
      filename = "#{start_date}
    #{end_date}
    json"
    file = File.open(File.join(Dir.pwd, '/tmp', filename), "w")
      file.puts(
    .to_json)
      file.close
      file
    end

(An aside: does anyone ever get tired of these awesome Rails bits? Where else
can you write `2.months.ago`?)

Nothing fancy here. We set up the file name, create it with `File.open` (when it
doesn’t find a file there, it will make one), then write our data to that file.
I learned through this process that `file.close` is absolutely necessary — it’s
like “save”.

#### Sending the file to AWS

Now that our file is ready, we can send it to AWS. I wrapped this method inside
a `if Rails.env.production?` so that we wouldn’t send any files in development
or testing environments (more on that in a bit).

For this functionality, we need the [AWS “official” Ruby
gem](https://github.com/aws/aws-sdk-ruby). Unfortunately, I found massive
inconsistency between this gem and what is on Amazon’s website. The hint here is
if you see Amazon talking about method calls with `AWS`, you know they are
outdated docs. The gem now uses `Aws`.

Ship it to our bucket:

    s3 = Aws::S3::Resource.new
    obj = s3.bucket(S3_BUCKET).object(
    )
    obj.upload_file(
    )

Line 1 sets up the connection. Line 2 establishes which object we are going to
send. Line 3 actually uploads the object. Here our `filename` will be the one we
generated earlier. The `filepath` is just the path to our file. Careful that
your test, development, staging and production environments will all see the
same filepath or adjust accordingly.

And that’s it! In my feature, I wanted to delete that file from our system when
it was uploaded, so I just called `File.delete(file)` after the upload runs.
Amazon returns a 200 status with an empty body if the file is uploaded, so you
can condition the file deletion based on that if you like.

### Slightly harder: Generating a pre-signed URL for uploading from the client

Uploading directly from the server is fine and dandy, but that means the file
needs to be on the server. For most of us, we are getting data we want to store
remotely from the users themselves, which means we need the *client* to be able
to upload. Amazon’s answer to this is a bit of a cluster-fuck multi-step
process:

1.  The client has to tell the server what the file is that will be uploaded
1.  The server prepares the request, then asks Amazon for a “pre-signed url”
1.  Amazon verifies the server’s credentials, then returns the pre-signed url
1.  The server sends the pre-signed url to the client
1.  The client uses the url to PUT a request to Amazon
1.  The client updates the user with the url of their profile image

### 1. The endpoint

To handle step 1, we have to generate an endpoint for the client to speak with.
I just made ours `/users/:id/presigned_url`. The client sends the image name and
the server handles the rest.

#### Check if it’s an image

I added this perhaps-unnecessary step to make sure the client (or any future
client) wasn’t sending us garbage that would throw errors somewhere along the
line:

    def
    is_image?(
    )
      regex = Regexp.union(/.\.png$/i, /.\.jpg$/i, /.\.jpeg$/i)
      
    .
    (regex)
    end

### 2 & 3. Getting the pre-signed url from Amazon

We’re still using the [AWS Ruby gem](https://github.com/aws/aws-sdk-ruby) for
these actions. First, we have to set up the filename. If there is a folder in
the S3 bucket, it will put the file there. If not, it will create the folder. I
followed a pattern from a previous version of our api:

    filename = "users/#{
    }/profile_images/#{
    }"

Now our main method will make the request to Amazon:

    def call
      signer = Aws::S3::Presigner.new
      signer.presigned_url(:put_object,
                           bucket: BUCKET,
                           key: filename,
                           acl: 'public-read',
                           content_type: "image/#{image_type}")
    end

The gem has its own method for speaking to the AWS pre-signed url interface. So
we create a `signer`, then we make the request. This part took a lot of research
and in the end I still had to field problems on the app side before I understood
what was needed.

We have to pass `:put_object` because that is exactly what Amazon / the gem
wants to see. The bucket is the name of the bucket where you want to store these
images. Note that you can have lots of buckets and should keep things organized.
Our bucket for data storage and our bucket for profile pictures are separate.

The `key` is the filename that comes from the client. `acl: 'public-read'` sets
a policy on the uploaded image that it can be viewed by anyone. You want this
for things like profile pictures, obviously not for internal documents.

Finally, Amazon needs you to tell it what kind of data to expect.

If you’ve made the request correctly, Amazon will return a 200 and the
pre-signed URL. Nice!

### 4. Send the pre-signed URL to the client

(Another aside: I work with both Rails servers and Javascript clients and, while
it’s not perfect for everything, the straightforward “wait for it to complete”
style of Ruby makes my heart sing. I can prepare files, make HTTP requests and
meanwhile my code just sits around until I get the response back from the
request. Nothing fancy needed. It’s so easy.)

When the response comes back from Amazon with the url, we drop it in a response
to the client:

    response = { data: { url: url } }
    render_response response

I should really do some error-handling here… but that’s for another day. In the
meantime, the client won’t get a url if there is no url to return — or it will
get some funky error message from Amazon.

From here, it’s the client’s job to handle things. They’ll take that big, nasty
pre-signed url from Amazon, PUT the image to it, then update the user via the
normal endpoints. The *client *will receive the URL where the document has been
uploaded, not the pre-signer on the server — more on that later.

### .env

Remember that the first thing we did was put our credentials into a `.env` file?
We haven’t referenced them anywhere, but the AWS gem is grabbing them behind the
scenes. You’ll get all manner of errors if you forget this step.

### Testing

It would hardly be a Rails app if we didn’t test these functionalities.

#### Data storage tests

I’ve put the data storage into a service worker, so all I have to do is generate
the data I want to save, then call the service. After, I’ll reload the document
(we’re using MongoDB here but all of this would work fine with Postgres) and see
that the data has been removed.

We’ll have to manually test the service worker (commenting out the bit about
`Rails.env.production?` to make sure everything is working all the way to the
AWS bucket. Once we’re satisfied, we can stub the call:

    stub_request(:put, "https://#{Scripts::RemoveOldData::S3_BUCKET}" +
        ".s3-#{ENV['AWS_REGION']}" +
        ".amazonaws.com/20170219-20170319.json")
        .to_return(status: 200, body: "", headers: {})

We’re using Webmocks which comes with a handy stub-helper. This is what the
constructed request looks like (built by the AWS gem), and as I mentioned it
returns a 200 status and an empty body. We could also stub the returned data,
but we don’t care because that’s the end of the line for this function.

#### Presigned URL tests

Here’s our Rspec test for this endpoint:

    describe "GET /users/:id/presigned_url" do
      let(:valid_params) { { filename: "image.png" } }
      it "returns a signed URL for upload to S3" do
        api_get presigned_url_user_path(student), 
            headers: student_auth_header,
            params: valid_params
        expect(response).to have_http_status(200)
        url_response = Addressable::URI.parse(JSON.parse(response.body)["data"]["url"])
        expect(url_response.host).to eq("#{V2::Users::S3ImageUploader::BUCKET}.s3.us-stubbed-1.amazonaws.com")
        expect(url_response.request_uri.split('?')[0]).to eq("/users/#{student.to_param}/profile_images/image.png")
      end
    end

Our first expectation is that we get a 200 status when we make a request to the
pre-signed URL. Next we want to make sure our response (which we construct in
the controller as noted above) is returning the proper URL. We have to do the
ugly `split` business because the URL changes based on the date and has some
randomized characters so better to just chop it all off in tests.

The most important part of this and the only reason this works is because we put
this line in our `test` environment (found in config):

    Aws.config[:s3] = { stub_responses: { put_object: 
    } }

This also took me tons of research and it was not documented at all. I got this
line out of a closed issue on the AWS Ruby gem repo. When you throw this in
here, it will return that `us-stubbed-1` as you can see in the spec above. I
wanted it to live in `rails_helper` but it didn’t seem to be happy there.

#### Manually testing via Postman

Finally, to make sure all of this is working before you send it over to the
front-end team, you want to test it manually. The data storage call is simple —
just make the request and then check your bucket. Done and done.

To test uploading images, you have to set up the request using Postman’s
`binary` option, *not* the `form-data` option. You must also do a PUT request
and not a POST. In our system, this is a three-step operation:

1.  Sign into the system and get your auth token
1.  Request the pre-signed URL while “logged in”
1.  Make the PUT request to Amazon.

But once you do all of these steps, you’ll get back a 200 (and not an error) and
the image will be on the server, ready to be viewed. It took us some finagling
with the different server settings before this worked, so hopefully the ones
noted above are going fine for you!

Until next time peeps. And PS: if you thought this was helpful, I’d sure
appreciate your heart or clap or whatever the hell Medium has decided is the new
“like”.

### Update: direct upload from a React client

A few weeks after completing this ticket, we needed to make a few more uploads
to S3, this time using our React web client. Now I’d have to tackle steps 5–6
myself. Here’s how we did it:

#### ReactS3Uploader

We used the React library
[react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader), which
mostly did everything exactly as you’d expect and made the many-step process
much simpler. Here’s our code:

    const s3Uploader = props => {
      const addFileToBookingObject = ( file, upload ) => {
        const filename = file.name.split(/(\\|\/)/g).pop();
        this.setState(prevState => ({ 
          filenames: prevState.filenames.concat(filename) 
        }),
          () => 
    );
        upload(file)
      };
      return <ReactS3Uploader
        signingUrl={`${process.env.HOST}/things/presigned_url`}
        signingUrlMethod="GET"
        signingUrlHeaders={this.headers}
        signingUrlWithCredentials={true}
        uploadRequestHeaders={{ 'acl': 'public-read' }}
        contentDisposition="auto"
        preprocess={addFileToBookingObject}
      />;
    };

Here’s what you can see: we are using this `ReactS3Uploader` component to *both*
talk to the server (at `process.env.HOST`) to get the pre-signed url *and* to
upload the file directly to S3. Note that the client does not need any AWS
credentials, including the bucket. All of that is handled on the server (and
explained above).

This guy is handling the request for steps 1–5. Handy, right? A couple of notes:

* The `uploadRequestHeaders` needs to match what the server is doing *exactly*. We
had a slightly different `acl` header for a while, that was throwing all kinds
of errors for us. When we got them synced, everything went fine.
* There are a number of methods that this component can take — `preprocess`,
`onProgress` (for a status bar), `onError`, `onFinish`.
* Since we are overwriting the standard `preprocess` function, we have to trigger
the callback when we’re done working with the file. That `upload()` function can
be called anything you like and is passed as a second argument automatically by
the `ReactS3Uploader`.
* This library expects your server to send a `signedUrl` in the root of the object
it returns. It sends a `objectName` and `contentType`. If you don’t handle those
items in your server, none of this will work.

#### Getting the file information to your Redux form

Talking to the server and Amazon was not that bad, really. The react-s3-uploader
library is nice and easy and does all the heavy async lifting for you. But
getting that information into the Redux form where it lived proved a little bit
trickier. Here’s that code:

    <Field component={s3Uploader} name="file_links" />

Putting the S3 component into a Field “registers” it in the Redux form. I was
stuck on this forever until a colleague took a look. I bolded the code above,
but this is the line that was missing and that allowed Redux to “see” changes to
this field:

    props.input.onChange(this.state.filenames)

The `s3Uploader` component receives props, and included on `input` is a built-in
Redux form method for seeing value changes. The form was updating! Now that the
file names were being processed (after some serialization so that they would be
saved in a proper format in the database)

#### Finishing touches

Finally, we wanted to show the files the user had chosen for upload so they
could manage them. This was all that was required.

    const removeFile = (file) => {
      const { filenames } = this.state;
      const index = filenames.indexOf(file);
      this.setState(prevState => ({
        filenames: [...prevState.filenames.slice(0, index),  
                    ...prevState.filenames.slice(index+1)]
      }))
      props.input.onChange(filenames)
    };

    {filenames.map(file => (
      <div key={file}> {file} 
        <span className="cancel" onClick={() => removeFile(file)}>
          X
        </span>
      </div>
    ))}

Here we’re taking the filenames that we update when the file picker returns a
value, displaying each of them on the form and allowing the user to remove them.

One note: each of the files that the user selects is *automatically* uploaded to
Amazon. That is, even if they click “remove”, that file is going to live in our
S3 bucket indefinitely. It’s not an amazing solution, but it doesn’t affect user
experience at all (as we haven’t connected the file to the user record).

And that is it! It was (sort of) fun to finish up this feature, as opposed to
sending it off to the app team to wrap up, as before the update. Before I got
the tip from a colleague, I was very seriously stuck on getting the information
into the Redux form state. Yay for collaboration!

### More updates: ever better

This part of the code has been a perpetual refinement and here months later I am
doing things even better.

Here’s the new basic uploader in the React client:

    const onFinish = file => {
      const regex = /(?:(?!\?).)*/;
      const filename = file.signedUrl.match(regex)[0];
      addFilename(filename, input.onChange);
    };
      <ReactS3Uploader
        multiple
        signingUrl={`${process.env.HOST}/presigned_url`}
        signingUrlMethod="GET"
        signingUrlHeaders={headers}
        signingUrlWithCredentials={true}
        signingUrlQueryParams={{ type, id }}
        uploadRequestHeaders={{ 'acl': 'public-read' }}
        contentDisposition="auto"
        onFinish={onFinish}
        onProgress={onProgress}
        scrubFilename={( filename ) => filename.replace(/[^\w\d_\-.]+/ig, '')}
        className={className}
      />

#### onFinish

Using the `onFinish` param in the library’s component, we read out the response
from AWS to create the file name. We were pushed to fix this problem when our
users tried to upload files with Swedish characters. Amazon simply converts them
to “regular” characters — å to a — and totally screws us on the file name.
Luckily, it’s available for us if we just reach out and grab it, as above.

This refactor made my heart sing. Until next time.
