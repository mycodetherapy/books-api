# This is an example of CRUD and server rendering using the EJS template engine.

### If you want to work with the project locally, follow these steps:

1. `git clone <repo name>`
2. Go to the project folder
3. `npm install`
4. Starting in development mode `npm run dev`
   <br>or
5. Starting in normal mode `npm start`
6. In the browser, go to: `http://localhost:3000` |
   <br>or
   Use API:

### Methods

| Method   | URL                       | Action                  | Comment                                                                                                          |
|----------|---------------------------|-------------------------|------------------------------------------------------------------------------------------------------------------|
| `POST`   | `/api/user/signin`        | user registration       | `{ username: "name", password: "password" }`                                                                     
| `POST`   | `/api/user/login`         | user authorization      | `{ username: "name", password: "password" }`                                                                     |
| `GET`    | `/api/user/me`            | user profile            | send token                                                                                                       
| `DELETE` | `/api/user/:id`           | delete user             | send token and id                                                                                                |
| `GET`    | `/api/books`              | get all books           | retrieves an array of all books                                                                                  |
| `GET`    | `/api/books/:id`          | get a book by **ID**    | retrieves a book object; if the record is not found, returns **Code: 404**                                       |
| `GET`    | `/api/books/:id/download` | download book by **ID** | The method gives the book file to download by its :id; if the record or file is not found, returns **Code: 404** |
| `POST`   | `/api/books`              | create a book           | creates a book and returns it with an assigned **ID**                                                            |
| `PUT`    | `/api/books/:id`          | edit a book by **ID**   | edits a book object; if the record is not found, returns **Code: 404**                                           |
| `DELETE` | `/api/books/:id`          | delete a book by **ID** | deletes a book and returns the response: **'ok'**                                                                |

### Happy use!
