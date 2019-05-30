---
title: "How to post-process user images programmatically with Rails & Amazon S3(including testing)"
draft: false
date: "2018-10-10"
---

### The problem

In our platforms, we allow our users to upload their own images for profile
pictures. This results, as you might imagine, in a wide variety of image sizing,
quality and formats. We display these images in various ways throughout our
platforms.

![“Street” art in Bucharest, Romania. Totally related to post-processing images.](https://cdn-images-1.medium.com/max/2600/1*v1Pr428uI0vmh25_cDl-eQ.jpeg)

For the most part, we can avoid sizing problems by manually setting sizing on
the image tag. But in one very important place — emails — certain servers ignore
our styling and display those images at full size: enormous.

We need a way to reformat user images programmatically. Additionally, since
we’re going to be messing with the images anyway, we’d like to auto-rotate,
adjust levels and colors, and generally make them as nice and as consistent as
we can.

### Considerations

* Our images are stored with Amazon’s S3 cloud storage. Fortunately Amazon offers
a relatively easy-to-use API for interacting with their services.
* Because our images are on S3, I thought it would be excellent to have this
service as a Lambda function, triggered when a user uploads a photo.
Unfortunately I could not, for the damn life of me, get anything to print in the
CloudWatch console (where the logs should appear). After bashing up against this
wall for a day, I decided to take it back in-house.
* We host on Heroku, which offers a free and simple scheduler to run tasks. It’s
not critical for us to have these images converted immediately upon upload. We
can schedule a job that picks up everything new in the last 10 minutes, and
convert it.

### The Worker

What’s needed now is a worker we can call as frequently as Heroku will allow us
(10 minutes is the shortest interval).

#### Gathering the right users

First we’ll gather all users that have images that need to be converted. We’ve
been storing user images in a specific pattern in our S3 bucket that includes a
`files` folder. We can just search for users whose profile pictures Regex
matches in `files`:

    User.
    (profilePictureUrl: { '$regex': %r(\/files\/) })

Your mileage may vary here, search-wise: we use a Mongo database.

Of course, we will be using a different pattern for processed images. This will
only pick up those who have uploaded new images since the task last ran. We’ll
loop through each of these users and perform the following.

#### Setting up a temporary file

We’ll need somewhere to store the image data we are going to manipulate. We can
do that with a `tmp` folder. We’ll use this as a holding place for the image we
want to upload to the new S3 location. We’ll name it as we’d like our final
image to be named. We wanted to simplify and standardize images in our system,
so we’re using the unique user id as the image name:

    @temp_file_location = "./tmp/#{user.id}.png"

#### Getting the raw image and saving it locally

Now we’ll talk to our S3 bucket and get the user’s raw, giant, unformatted
image:

    key = URI.parse(user.profilePictureUrl).path.gsub(%r(\A\/), '')
    s3 = Aws::S3::Client.new
    response = s3.get_object(bucket: ENV['AWS_BUCKET'], key: key)

The `key` code there is taking the URL string that we’ve saved as the user’s
`profilePictureUrl` and chopping off everything that’s not the end path to the
picture.

For instance, `http://images.someimages.com/whatever/12345/image.png` would
return `whatever/12345/image.png` from that code. That’s exactly what S3 wants
from us to find the image in our bucket. Here’s the handy `aws-sdk` gem working
for us with `get_object`.

Now we can call `response.body.read` to get a blob of an image (blob is the
right word, though it’s above my pay grade to really understand how images are
sent back-and-forth across the web). We can write that blob locally in our tmp
folder:

    File.open(@temp_file_location, 'wb') { |file| file.write(response.body.read) }

If we stop here, you’ll see you can actually open up that file in your temp
folder (with the name you set above — in our case `<user-id>.png` ).

#### Process the image

Now we’ve got the image downloaded from Amazon, we can do whatever we want to
it! ImageMagick is an amazing tool freely available for everybody.

We used a pared-down version for Rails called
[MiniMagick](https://github.com/minimagick/minimagick). That gem also has a
great API that makes things lickety-split easy. We don’t even have to do
anything special to pick up the image. The `@temp_file_location` we used earlier
to save the image will work fine to bring it to MiniMagick’s attention:

    image = MiniMagick::Image.new(@temp_file_location)

Here’s the settings for our photos, but there are *tons* of options to play
with:

    image.combine_options do |img|
      img.resize '300x300>'
      img.auto_orient
      img.auto_level
      img.auto_gamma
      img.sharpen '0x3'
      image.format 'png'
    end

`combine_options` is a handy way to do a bunch of stuff to an image in one
block. When it exits, the image is saved again where it was before. (Image
formatting can’t be done with the `img` from `combine_options`.) Now that image
file in our temporary folder is all kinds of post-processed!

#### Upload back to S3 and save as the user’s new profile picture

Now all we have to do is set up another connection to S3 and make the upload:

    Aws.config.update(
      region: ENV['AWS_REGION'],
      credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY']))
    s3 = Aws::S3::Resource.new
    name = File.basename(@temp_file_location)
    bucket = ENV['AWS_BUCKET'] + '-output'
    obj = s3.bucket(bucket).object(name)
    obj.upload_file(@temp_file_location, acl: 'public-read')

By convention with Lambda, auto tasks will send to a new bucket with the old
bucket’s name plus “-output” appended, so I stuck with that. All formatted user
images will be dumped into this bucket. Since we are naming the images by
(unique) user ids, we are sure we’ll never overwrite one user’s picture with
another.

We create a new object with the new file’s name, in the bucket of our choice,
and then we `upload_file`. It has to be `public-read` if we want it visible
without a lot of headache on our clients (you may choose a different security
option).

If that last line returns true (which it will, if the upload goes smoothly), we
can update our user record:

    new_url = "https://s3.amazonaws.com/#{ENV['AWS_BUCKET']}-output/#{File.basename(@temp_file_location)}"
    user.update(profilePictureUrl: new_url)

And that’s it! If we run this guy, we’ll auto-format and resize all user images
in the system. All the original images will be in place in their old pattern
(and in case anything goes wrong), and all users’ links will point to their new,
formatted images.

### Testing

We couldn’t possibly add a new feature to a Rails application without testing,
right? Absolutely. Here’s what our tests for this look like:

    RSpec.describe Scripts::StandardizeImages, type: :service do
      let!(:user) { User.make!(:student, profilePictureUrl: 'https://s3.amazonaws.com/files/some_picture.jpg') }
      before do
        stub_request(:get, 'https://s3.amazonaws.com/files/some_picture.jpg')
          .with(
            headers: {
              'Accept' 
    '*/*',
              'Accept-Encoding' 
    'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
              'Host' 
    's3.amazonaws.com',
              'User-Agent' 
    'Ruby'
            }
          )
          .to_return(status: 200, body: '', headers: {})
        allow_any_instance_of(MiniMagick::Image).to receive(:combine_options).and_return(true)
        allow_any_instance_of(Aws::S3::Object).to receive(:upload_file).and_return(true)
      end
      describe '.call' do
        it 'finds all users with non-updated profile pictures, downloads, reformats and then uploads new picture' do
          Scripts::StandardizeImages.call
          expect(user.reload.profilePictureUrl)
            .to eq "https://s3.amazonaws.com/#{ENV['AWS_BUCKET']}-output/#{user.to_param}.png"
        end
      end
    end

If you look first at the test itself, you’ll see we are testing that our user’s
new profile picture URL was saved correctly. The rest of it we don’t so much
care about, since we don’t actually want our test downloading anything, and we
probably don’t want to spend the time for our test to be manipulating images.

But of course the code is going to try to talk to Amazon and spin up MiniMagick.
Instead, we can stub those calls. Just in case this is new for you, I’ll run
through this part.

#### Stubbing calls

If you aren’t mocking calls in your tests, you probably ought to start doing
that immediately. All that’s required is the Webmock gem. You require it in your
`rails_helper` and that’s about it.

When your test tries to make a call to an external source, you’ll get a message
like this (I’ve hidden private keys and things with …s):

    WebMock::NetConnectNotAllowedError:
           Real HTTP connections are disabled. Unregistered request: GET https://...

    You can stub this request with the following snippet:

    stub_request(:get, "https://...").
             with(
               headers: {
              'Accept'=>'*/*',
              'Accept-Encoding'=>'',
              'Authorization'=>...}).
             to_return(status: 200, body: "", headers: {})

Just copy the `stub_request` bit and you’re well on your way to stubbing glory.
You may need to return something in that `body`, depending on what you are doing
with the external API call.

I found it difficult to get this stubbed response to return something my code
would see as an image, so I just stubbed the `MiniMagick` function as well. This
works fine because we are not seeing the output in this test anyway. You’ll have
to manually test that the image is getting the proper formatting.

Alternatively, you can use `Aws.config[:s3] = { stub_responses: true }` in your
test initializer or possibly on your `rails_helper` to stub all S3 requests.

#### One final note: Travis CI

Depending on what options you decide to apply to your image, you may find that
Travis’ version of ImageMagick is not the same as yours. I tried lots of things
to get Travis using the same ImageMagick as I was. In the end, I am stubbing the
`MiniMagick` call, so it’s a moot point. But beware: if you don’t stub that
function, you may find your CI failing because it doesn’t recognize a newer
option (like `intensity`).

Thanks for reading!
