import "reflect-metadata";
import { Container } from "inversify";
import { BooksRepository } from "./repositories/BooksRepository.js";
import { BooksRepositoryImpl } from "./repositories/BooksRepositoryImpl.js";

const container = new Container();
//container.bind(BooksRepositoryImpl).toSelf();
container
  .bind<BooksRepository>(BooksRepository)
  .to(BooksRepositoryImpl)
  .inSingletonScope();

export { container };
