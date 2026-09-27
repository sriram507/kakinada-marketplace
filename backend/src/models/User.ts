// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";

// export type UserRole = "customer" | "seller" | "admin";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
//   comparePassword(candidate: string): Promise<boolean>;
// }

// const userSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true, minlength: 6 },
//     role: {
//       type: String,
//       enum: ["customer", "seller", "admin"],
//       default: "customer",
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving, only if it changed
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Instance method to check a login password against the stored hash
// userSchema.methods.comparePassword = async function (
//   candidate: string
// ): Promise<boolean> {
//   return bcrypt.compare(candidate, this.password);
// };

// export const User = mongoose.model<IUser>("User", userSchema);

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "customer" | "seller" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
