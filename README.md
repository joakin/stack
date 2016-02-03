stack
=====

A web application for stacking people for intervining in a conversation.

Helpful tool for facilitators and participants of meetings with a lot of people
or on-site and remote participants.

Deployed version: [stack.wmflabs.org](http://stack.wmflabs.org)

Run
---

* `npm install`
* Development: `npm start`
* Production: `PORT=80 node index.js`

TODO
----

* Server
  * [x] Migrate server to express
  * [x] Clean up server code
* Client
  * [x] Add buildtool  for better client side asset management
  * [x] Refactor frontend using es6 and modules
* Improvements
  * [x] Use SSE or websockets or long polling for communication
  * [ ] Change participant to set name when joining before they can add
    themselves
  * [ ] Checkbox for *I'm a facilitator* that enables being able to pop people
    from the stack (disabled by default)
  * [ ] Being able to manage the stack (remove participants on the middle, etc)
  * [x] Disallow contiguous participants in stack
  * [x] Improve styles
