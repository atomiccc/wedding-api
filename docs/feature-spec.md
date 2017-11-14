# room share

This feature will connect guests who don't know each other and want to share a room to save money.

## High level workflows

When user visits https://jenny.phillip.love they will be shown a room share section under accommodations.

If they don't have a valid session they will be prompted to either login or create an account. Sessions will not expire unless user explicitly says to logout.

Account will be their email address and password will be whatever they set it. Registration will require either 'rudnick' or 'mispagel' as validation so people who don't know us can't register.

Registration will also require the user to put their name and other information so that they aren't anonymous. Option to upload a picture will be given.  Basically there will be an account profile page for them to edit their account settings.

Once logged in users will be able to see existing posts and make new posts.  Posts will have comments.  Posts will include the preferred room category to be shared as well as how many people they are looking to share the room with.

Post creator will have the option of setting the post to 'completed' and optionally say which user they will be bunking with. Post / comment creators will have the option of editing and deleting posts / comments they create.

Posts will be styled using the account creators name.

## Technologies to be used
### API
* koa
* RethinkDB
* https
* session


### Frontend
* React
* Redux
* bootstrap
* cookies

## Other changes

_[Describe any other notable changes.]_
