# book-service
A REST based book microservice to handle CRUD operations on book entity.

### About
The service exposes the below endpoints
- GET: /books
  - Gets the list of all books.
- GET: /books/{isbn}
  - Gets the book record for the mentioned isbn (Internation Standard Book Number)
- POST: /books
  - Adds a book into the database
  - Sample Request:
    ```
    {
      "isbn": "3333",
      "author": "Siddharth Chaudhary",
      "title": "Book Service v4",
      "releaseDate": "2020-10-14T09:12:59.297Z"
    }
    ```
  - Sample Response:
    ```
    {
      "author": "Siddharth Chaudhary",
      "isbn": "3333",
      "releaseDate": "2020-10-14T09:12:59.297Z",
      "title": "Book Service v4",
      "resource": "http://localhost:8080/books/3333"
    }
    ```
- PUT: /books
  - Updates the book object on basis of isbn. The endpoint also validates if the book exists.
  - Sample Request:
    ```
    {
      "isbn": "3333",
      "author": "Siddharth Chaudhary",
      "title": "Book Service v3",
      "releaseDate": "2020-10-14T09:12:59.297Z"
    }
    ```
  - Sample Response:
    ```
    {
      "isbn": "3333",
      "author": "Siddharth Chaudhary",
      "title": "Book Service v3",
      "releaseDate": "2020-10-14T09:12:59.297Z",
      "resource": "http://localhost:8080/books/3333"
    }
    ```
- DELETE: /books/{isbn}
  - Updates the book object on basis of isbn. The endpoint also validates if the book exists.
  - Sample Response:
    ```
    {
      "code": 200,
      "message": "Success"
    }
    ```

### More about the service
- The code has been written using Typescript as the language of choice.
- For unit test cases, "mocha" and "assert" modules have been used.
- The backend database is on postgres, for which "pg" module has been used.
- Below is the list of dependencies used, keeping in mind no use of third party libs:
  ```
    "dependencies": {
      "@types/node": "^12.7.5",
      "@types/pg": "^7.14.5",
      "@types/mocha": "^5.2.7",
      "mocha": "^6.1.4",
      "nyc": "^14.1.0",
      "pg": "^8.4.1",
      "typescript": "3.8.3"
    }
  ```

### Prerequisites
Kindly run the below commands to setup the service locally:
- `npm install`

### Usage
For sake of local development and unit testing a docker-compose.yml has been setup and a few set of commands have been added into the scripts section.
- `npm run compose-prep` - Drop the existing containers and Setup the postgres container
- `npm run compose-up` - Setsup the service and executes the code

The docker-compose exposes 2 environment variables to control the way of execution
- DEBUG: true if you want to debug the code or unit-tes
- START_MODE:
  - ut: Run `npm run test`
  - code: Run `npm run start`
