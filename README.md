# Web Development Final Project - *Eco Board*

This web app: **Allows users to post about their eco-friendly contributions to other users, like and comment on other posts, and search through posts by keywords.**

Link: https://eco-board-5yf5.vercel.app/

Time spent: **18** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **A create form that allows the user to create posts**
- [x] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [x] **A home feed displaying previously created posts**
- [x] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [x] **Clicking on a post shall direct the user to a new page for the selected post**
- [x] **Users can sort posts by either their created time or upvotes count**
- [x] **Users can search for posts by title**
- [x] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [x] **Users can leave comments underneath a post on the post's separate page**
- [x] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [x] **A previously created post can be edited or deleted from its post page**

The following **optional** features are implemented:

- [x] Users can only edit and deleted posts or delete comments by entering the secret key, which is set by the user during post creation (Users can only edit and delete their own posts verified through user_id sent when an account is created)
- [x] Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them. (Users are able to sign up for an account set up through Clerk)

The following **additional** features are implemented:

* [x] Users are able to login using clerk to create an account
* [x] The username of the current user is shown on each post
* [x] Users not logged in may still view posts but they are not able to create or like posts

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://github.com/user-attachments/assets/14c140b7-0089-434f-84ab-59556edcb72c' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with [Kap](https://getkap.co/) for macOS  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

The biggest challenge was figuring out authentication with clerk.

## License

    Copyright [2024] [Erin Forrest]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

