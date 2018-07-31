# Flashtatu - A personal app, adapted to Teravoz challenge

### Introduction
Flashtatu is a personal project that, in short, is a rest API. I was using it for developing my skills and for endeavor reasons.

As one of the tasks were to show a little bit of code that I'm proud about, this one is a good example. I tried to make it simple and use no dependencies at all, using node API for most of it (except for socket.io).

### Documentation
  - WIP
  - I'll focus initialy on showing how to use my API on the challenge cases, for now, I have no documentation of the rest of the API.

#### Setup

After cloning this repository, you will have to install npm dependencies (socket.io). Just type on your console:
```sh
$ npm install
```
Then you can run the app itself:
```sh
$ node index
```

#### Sending a request

For this, you can use any client you want, but I've prepared a script for "testing". It will simulate all the challenge's cases.

- An unregistered customer calling, being registered in .data/customers collection, then being delegated to "*2900".
- The same customer, but now registered, calling. When his identity is found on the .data/customers collection, it is delegated to *2901

To run it, type on another tab of your console:
```sh
$ node _API.requests.mock.js
```
