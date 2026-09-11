import { createStubPublisher } from "./stub-publisher";
import type { Publisher } from "./types";

export const twitterPublisher = createStubPublisher("twitter");
export const facebookPublisher = createStubPublisher("facebook");
export const linkedinPublisher = createStubPublisher("linkedin");
export const instagramPublisher = createStubPublisher("instagram");
export const youtubePublisher = createStubPublisher("youtube");

export const allPublishers: Publisher[] = [
  twitterPublisher,
  facebookPublisher,
  linkedinPublisher,
  instagramPublisher,
  youtubePublisher,
];
