import { Types, Model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserModel = Model<IUserDocument>;
