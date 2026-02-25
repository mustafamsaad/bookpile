import mongoose, { Schema, models, model } from "mongoose";

export interface IBookmark {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  headline: string;
  url: string;
  content?: string;
  image?: string;
  platform: string;
  customPlatformName?: string;
  customPlatformIcon?: string;
  customPlatformColor?: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    headline: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    content: { type: String, trim: true, maxlength: 500 },
    image: { type: String },
    platform: {
      type: String,
      required: true,
      enum: [
        "facebook", "x", "reddit", "youtube", "instagram",
        "linkedin", "github", "pinterest", "tiktok", "medium",
        "stackoverflow", "other",
      ],
    },
    customPlatformName: { type: String, trim: true },
    customPlatformIcon: { type: String },
    customPlatformColor: { type: String },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, platform: 1 });
BookmarkSchema.index({ userId: 1, topic: 1 });

if (models.Bookmark) {
  delete models.Bookmark;
}
const Bookmark = model<IBookmark>("Bookmark", BookmarkSchema);
export default Bookmark;
