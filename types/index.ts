export const PLATFORMS = [
  "facebook",
  "x",
  "reddit",
  "youtube",
  "instagram",
  "linkedin",
  "github",
  "pinterest",
  "tiktok",
  "medium",
  "stackoverflow",
  "other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "Facebook",
  x: "X (Twitter)",
  reddit: "Reddit",
  youtube: "YouTube",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  medium: "Medium",
  stackoverflow: "Stack Overflow",
  other: "Other",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  facebook: "var(--color-platform-facebook)",
  x: "var(--color-platform-x)",
  reddit: "var(--color-platform-reddit)",
  youtube: "var(--color-platform-youtube)",
  instagram: "var(--color-platform-instagram)",
  linkedin: "var(--color-platform-linkedin)",
  github: "var(--color-platform-github)",
  pinterest: "var(--color-platform-pinterest)",
  tiktok: "var(--color-platform-tiktok)",
  medium: "var(--color-platform-medium)",
  stackoverflow: "var(--color-platform-stackoverflow)",
  other: "var(--color-platform-other)",
};

export const TOPICS = [
  "tech",
  "programming",
  "religion",
  "science",
  "entertainment",
  "news",
  "education",
  "design",
  "business",
  "other",
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  tech: "Tech",
  programming: "Programming",
  religion: "Religion",
  science: "Science",
  entertainment: "Entertainment",
  news: "News",
  education: "Education",
  design: "Design",
  business: "Business",
  other: "Other",
};

export interface Bookmark {
  _id: string;
  userId: string;
  headline: string;
  url: string;
  content?: string;
  image?: string;
  platform: Platform;
  customPlatformName?: string;
  customPlatformIcon?: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  customPlatforms: { name: string; color?: string }[];
  customTopics: string[];
  createdAt: string;
  updatedAt: string;
}

export const CURRENTCOLOR_PLATFORMS: Platform[] = ["x", "github", "tiktok", "medium", "other"];

export const DARK_BG_PLATFORMS: Platform[] = [
  "facebook", "reddit", "youtube", "instagram", "linkedin",
  "pinterest", "stackoverflow", "other",
];

export const LIGHT_BG_IN_DARK_PLATFORMS: Platform[] = ["x", "github", "tiktok", "medium"];
