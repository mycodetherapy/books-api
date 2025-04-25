import { injectable } from "inversify";
import { UserRepository } from "./UserRepository.js";
import User from "../models/User.js";
import { IUser } from "../interfaces/IUser.js";

@injectable()
export class UserRepositoryImpl extends UserRepository {
  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async createUser(user: IUser): Promise<IUser> {
    const newUser = new User(user);
    return newUser.save();
  }
}
