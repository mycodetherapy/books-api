# This is an example of a CRUD REST api with express

### If you want to work with the project locally, follow these steps:

1. `git clone <repo name>`
2. Go to the project folder
3. `npm install`
4. Starting in development mode `npm run dev`
   <br>or
5. Starting in normal mode `npm start`

### Methods

| Method   | URL                       | Action                  | Comment                                                                                                          |
| -------- | ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/api/user/login`         | user authorization      | this method always returns **Code: 201** and a static object: `{ id: 1, mail: "test@mail.ru" }`                  |
| `GET`    | `/api/books`              | get all books           | retrieves an array of all books                                                                                  |
| `GET`    | `/api/books/:id`          | get a book by **ID**    | retrieves a book object; if the record is not found, returns **Code: 404**                                       |
| `GET`    | `/api/books/:id/download` | download book by **ID** | The method gives the book file to download by its :id; if the record or file is not found, returns **Code: 404** |
| `POST`   | `/api/books`              | create a book           | creates a book and returns it with an assigned **ID**                                                            |
| `PUT`    | `/api/books/:id`          | edit a book by **ID**   | edits a book object; if the record is not found, returns **Code: 404**                                           |
| `DELETE` | `/api/books/:id`          | delete a book by **ID** | deletes a book and returns the response: **'ok'**                                                                |

### Happy use!
