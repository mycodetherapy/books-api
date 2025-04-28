import { IUser } from "../interfaces/IUser.js";

export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<IUser | null>;
  abstract createUser(user: Omit<IUser, "_id">): Promise<IUser>;
  abstract deleteUserById(id: string): Promise<IUser | null>;
  abstract findById(id: string): Promise<IUser | null>;
}
