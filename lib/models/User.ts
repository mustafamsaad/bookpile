import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  customPlatforms: { name: string; color?: string }[];
  customTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    customPlatforms: [
      {
        name: { type: String, required: true },
        color: { type: String },
      },
    ],
    customTopics: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
