import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

export const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChnagedAt: { type: Date },
    role: {
      type: String,
      enum: ["admin", "student", "faculty"],
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// pre save middleware/hook : will work on create() and save()
userSchema.pre("save", async function (next) {
  const user = this; // get the document

  //hashing the password before save to db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//set emty string '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// create static function
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id });
};

userSchema.statics.isPasswordMatched = async function (
  palinTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(palinTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
