import { v4 as uuid } from 'uuid';

export class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = false,
    fileCover = '',
    fileName = '',
    filePath = '',
    views = 0,
    id = uuid(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover || filePath;
    this.fileName = fileName;
    this.filePath = filePath;
    this.views = views;
  }
}
