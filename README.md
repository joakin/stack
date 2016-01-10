stack
=====

A web application for queueing people for intervining in a conversation.

Helpful tool for facilitators and participants of meetings with a lot of people
or on-site and remote participants.

Deployed version: [stack.wmflabs.org](http://stack.wmflabs.org)

Run
---

`PORT=80 node index.js`

TODO
----

* Server
  * [ ] Migrate server to express
  * [ ] Clean up server code
* Client
  * [ ] Add buildtool  for better client side asset management
  * [ ] Refactor frontend using es6 and modules
* Improvements
  * [ ] Use SSE or websockets or long polling for communication
  * [ ] Change participant to set name when joining before they can add
    themselves
  * [ ] Checkbox for *I'm a facilitator* that enables being able to pop people
    from the stack (disabled by default)
  * [ ] Being able to manage the queue (remove participants on the middle, etc)
  * [ ] Disallow contiguous participants in queue
