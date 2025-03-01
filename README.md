```
db.books.insertMany([
  {
    title: "Книга 1",
    description: "Какое-то описание для книги 1.",
    authors: "Автор 1"
  },
  {
    title: "Книга 2",
    description: "Какое-то описание для книги 2.",
    authors: "Harper Lee"
  }
]);

db.books.find({ title: "Книга 2" });

db.books.updateOne(
  { _id: ObjectId("OBJECT_ID") },
  {
    $set: {
      description: "Новое описание.",
      authors: "Новый автор"
    }
  }
);

```
