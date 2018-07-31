# Flashtatu - A personal app, adapted to Teravoz challenge

### Introduction
Flashtatu is a personal project that, in short, is a rest API. I was using it for developing my skills and for endeavor reasons.

As one of the tasks were to show a little bit of code that I'm proud about, this one is a good example. I tried to make it simple and use no dependencies at all, using node API for most of it (except for socket.io).

### Documentation

  - WIP
  - I'll focus initialy on showing how to use my API on the challenge cases, for now, I have no documentation of the rest of the API.

#### Setup

After cloning this repository, you will have to install npm dependencies (socket.io) UNUSED for now, but I'm working on it (for the dashboard). Just type on your console:
```sh
$ npm install
```
Then you can run the app itself:
```sh
$ node index
```
On start up, it will check and create the folders needed for our .json data base to work, the base folder ```./.data```, and other collections as ```./.data/customer```, ```./.data/user```, ```./.data/tokens```, ```./.data/products```

#### Sending a request

For this, you can use any client you want, but I've prepared a script for "testing". It will simulate all the challenge's cases.

```js
{
  "type": "call.standby",
  "call_id": "1463669263.30033",
  "code": "123456",
  "direction": "inbound",
  "our_number": "0800000000",
  "their_number": "11991910000",
  "timestamp": "2017-01-01T00:00:00Z"
}
```

- An unregistered customer calling, being registered in .data/customers collection, then being delegated to "*2900".
- The same customer, but now registered, calling. When his identity is found on the .data/customers collection, it is delegated to *2901

To run it, type on another tab of your console:
```sh
$ node _API.requests.mock.js
```

And it will be printed its delegation.

Sending it twice, cause the delegation to 901, as the customer will already be registered. 

**Flashtatu API - Official documentation 0.0.1v**
----
  <_This API was designed for being the base for Flashtatu Platform. It will administrate ```users```, ```tokens```, ```products```, ```carts```._>

## /user
  * **Method:**

    `GET`
  
  *  **Params** 

  ```REQUIRES AUTHENTICATION TOKEN```

  Query string: 
  ?email=
  ```txt
  /user?email=valid@email.com
  ```
  *  **Success Response:**
  
    ```js
    {
      "firstName": "John",
      "lastName": "Doe",
      "emailAddress": "johndoe@email.com",
      "streetAddress": "Doe",
      "tosAgreement": true
    }
    ```
    * **Code:** 200 <br />
    * **Content:** `{"firstName":"John","lastName":"Doe","emailAddress":"johndoe@email.com","streetAddress":"Doe","tosAgreement":true}`
----
  * **Method:**

    `POST`
  
  *  **Params** 
  JSON on request body
  ```js
  {
    "firstName": "String",
    "lastName": "String",
    "emailAddress": "String (valid e-mail)",
    "streetAddress": "String (for now, no format validation)",
    "password": "String (for now, a password with more than 10 characters)",
    "tosAgreement": "Boolean, but for a successful User POST, it needs to be true"
  }
  ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `User created successfully`