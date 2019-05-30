---
title: "Model helpers in Rails: Concerns"
draft: false
date: "2018-02-20"
---
You may be familiar with the concept of helpers in Rails: places to stick the
code that otherwise would clog up your controllers. Rails has a great folder
where you’re meant to put them. It’s called `helpers`. Today I tried to add a
helper for a model. Wuh-woh, that’s not where we put helper code for models.

![Extracting logic to concerns and helpers can keep your code base clean and allow
  easy removal of chunks of code. Like camels walking in the desert…](https://cdn-images-1.medium.com/max/2600/1*ybrGZSdQLr1MsLbuGRkJjA.jpeg)

### How they’re used

After much googling, I came upon the solution: `concerns`. When I went to add
one for my model, I realized we already had the folder sitting empty, just
waiting to be filled with code that we can extract out of our models (good old
“convention over configuration”).

#### vs. Helpers

Here’s a typical `helper`:

    # app/helpers/params_helper.rb

    module 
    def sort_params
        params.permit(:sort).fetch(:sort, nil)
      end
      [...]
    end

We use this all over our controllers — there’s no need to have it in each of
them, or even in the `ApplicationController`. We can lighten up our controllers
by extracting various params methods here.

When we want to use these methods, we simply `include ::ParamsHelpers` at the
top of our controller. If you include it at the top of `ApplicationController`,
you’ll be able to use it in any controller that inherits from it (which in our
code base is every controller). Sometimes that’s exactly what you want (a helper
called `ParamsHelper` is the kind of one you want everywhere), other times
you’ll want to restrict it to a single controller.

#### Helpers for a model

What if you want to extract some of your model logic to a helper? You’ll quickly
realize you can’t call helper methods from within your model. We’ll need a
**Concern**.

Here’s what one might look like:

    module 
    extend ActiveSupport::Concern
      class_methods do
        def complicated_user_method(args)
         // lots of complicated user stuff
        end

        def another_complicated_method(args)
         // more stuff
        end
      end
    end

And you’ll use it by referencing the concern in your model:

    include ::UserConcern

The `extend ActiveSupport::Concern` allows us to write more elegant concerns and
also allows us to resolve various dependencies properly (not referenced here).
For more info, [check the
docs](http://api.rubyonrails.org/v5.0/classes/ActiveSupport/Concern.html).

And that it’s! Extracting a bunch of logic from my controllers into helpers and
from models into concerns makes my code base feel light and clean. It’s a good
feeling.
