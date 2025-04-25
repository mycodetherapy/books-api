import "reflect-metadata";
import { Container } from "inversify";
import { BooksRepository } from "./repositories/BooksRepository.js";
import { BooksRepositoryImpl } from "./repositories/BooksRepositoryImpl.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { UserRepositoryImpl } from "./repositories/UserRepositoryImpl.js";

const container = new Container();
container
  .bind<BooksRepository>(BooksRepository)
  .to(BooksRepositoryImpl)
  .inSingletonScope();
container
  .bind<UserRepository>(UserRepository)
  .to(UserRepositoryImpl)
  .inSingletonScope();

export { container };
