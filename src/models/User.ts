import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, IUserModel } from "../interfaces/IUser.js";

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    firstName: String,
    lastName: String,
    avatar: String,
    role: String,
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;

// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
//
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String },
//   firstName: { type: String },
//   lastName: { type: String },
//   avatar: { type: String },
//   role: { type: String },
//   createdAt: { type: Date },
//   updatedAt: { type: Date },
// });
//
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });
//
// userSchema.methods.comparePassword = async function (
//   candidatePassword: string,
// ) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };
//
// const User = mongoose.model("User", userSchema);
//
// export default User;
