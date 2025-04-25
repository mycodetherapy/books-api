import { IUser } from "../interfaces/IUser.js";

export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<IUser | null>;
  abstract createUser(user: IUser): Promise<IUser>;
}
