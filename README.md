# Flashtatu 0.0.1 - A personal app.

[New repo for new version](https://github.com/matheus510/flashtatu_api.git)

### Introduction
Flashtatu is a personal project that, in short, is a rest API for a future platform of Flash Tattoos. I'm using this as a chance to improve my developing skills.

As one of the tasks were to show a little bit of code that I'm proud about, this one is a good example. I tried to make it simple and use no dependencies at all, using node core API only. This is just a proof of concept (that I know how to work with node core modules, and how node works when it refers to data buffers, streams, pipes and etc.)

### Documentation

#### Setup

After cloning this repository you can run the app itself:
```sh
$ node index
```
If using docker, first build the image
```sh
$ docker build . -t matheus510/flashtatu
```
Run the docker container
```sh
$ docker run -p 5000:5000 -d matheus510/flashtatu
```

Then 
On start up, it will check and create the folders needed for our .json data base to work, the base folder ```./.data```, and other collections as ```./.data/customer```, ```./.data/user```, ```./.data/tokens```, ```./.data/tattoos```

**Flashtatu API - Official documentation 0.0.1v**
----
  <_This API was designed for being the base for Flashtatu Platform. It will administrate ```users```, ```tokens```, ```tattoos```, ```carts```. As cart module is not yet ready, I'll not document it for now._>

## /token
  * **Method:**

    `GET`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?id=
    ```txt
    /token?id=^[0-9]{8}$
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `{"emailAddress":"johndoe@email.com","id":"gqx4n8aa35vv2xn63yeg","expires":1533308197674}`
    ```js
    {
      "emailAddress": "johndoe@email.com",
      "id": "gqx4n8aa35vv2xn63yeg",
      "expires": 1533308197674
    }
    ```
----
  * **Method:**

    `POST`
  
  * **Params** 
    JSON on request body
    ```js
    {
      "firstName": "String",
      "lastName": "String",
      "emailAddress": "String (valid e-mail)",
      "streetAddress": "String (for now, no format validation)",
      "password": "String (for now, a password with more than 10 characters)",
      "tosAgreement": "Boolean, but for a successful token POST, it needs to be true"
    }
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `token created successfully`
----
  * **Method:**

    `DELETE`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?id=
    ```txt
    /token?id=^[0-9]{8}$
    ```
  
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `Deleted successfully`
----
## /tattoo
  * **Method:**

    `GET`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?name=
    ```txt
    /tattoo?name=validName
    ```
  * **Success Response:**
  
    * **Code:** 200 <br />
    * **Content:** `{"name":"GiantgreatswordTattoo","price":100,"id":"kw6046zeqsv2p2pp7csg"}`
    ```js
    {
      "name": "GiantgreatswordTattoo",
      "price": 100,
      "id": "kw6046zeqsv2p2pp7csg"
    }
    ```
----
  * **Method:**

    `POST`
  
  * **Params** 
    JSON on request body
    ```js
    {
      "name": "GiantgreatswordTattoo",
      "price": 100
    }
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `Tattoo created successfully`
----
  * **Method:**

    `PUT`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    JSON on request body
    ```js
    {
      "name": "GiantgreatswordTattoo",
      "price": 100
    }
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `{"name":"GiantgreatswordTattoo","price":100,"id":"kw6046zeqsv2p2pp7csg"}`
    ```js
    {
      "name": "GiantgreatswordTattoo",
      "price": 100,
      "id": "kw6046zeqsv2p2pp7csg"
    }
    ```
----
  * **Method:**

    `DELETE`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    ```js
    {
      "name": "GiantgreatswordTattoo"
    }
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `Deleted successfully`
----
## /user
  * **Method:**

    `GET`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?email=
    ```txt
    /user?email=valid@email.com
    ```
  * **Success Response:**
    * **Code:** 200 <br />
    * **Content:** `{"firstName":"John","lastName":"Doe","emailAddress":"johndoe@email.com","streetAddress":"Doe","tosAgreement":true}`
    ```js
    {
      "firstName": "John",
      "lastName": "Doe",
      "emailAddress": "johndoe@email.com",
      "streetAddress": "Doe",
      "tosAgreement": true
    }
    ```
----
  * **Method:**

    `POST`
  
  * **Params** 
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
----
  * **Method:**

    `PUT`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?email=
    ```txt
    /user?email=valid@email.com
    ```
  * **Success Response:**
  
    * **Code:** 200 <br />
    * **Content:** `{"firstName":"John","lastName":"Doe","emailAddress":"johndoe@email.com","streetAddress":"Doe","tosAgreement":true}`
    ```js
    {
      "firstName": "John",
      "lastName": "Doe",
      "emailAddress": "johndoe@email.com",
      "streetAddress": "Doe",
      "tosAgreement": true
    }
    ```
----
  * **Method:**

    `PUT`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?email=
    ```txt
    /user?email=valid@email.com
    ```
  * **Success Response:**
  
    * **Code:** 200 <br />
    * **Content:** `{"firstName":"John","lastName":"Doe","emailAddress":"johndoe@email.com","streetAddress":"Doe","tosAgreement":true}`
    ```js
    {
      "firstName": "John",
      "lastName": "Doe",
      "emailAddress": "johndoe@email.com",
      "streetAddress": "Doe",
      "tosAgreement": true
    }
    ```
----
  * **Method:**

    `DELETE`
  
  * **Params** 

    ```REQUIRES AUTHENTICATION TOKEN```

    Query string: 
    ?email=
    ```txt
    /user?email=valid@email.com
    ```
  * **Success Response:**

    * **Code:** 200 <br />
    * **Content:** `Deleted successfully`
----
