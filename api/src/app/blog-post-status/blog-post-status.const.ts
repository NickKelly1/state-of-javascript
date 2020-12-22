
export const BlogPostStatus = {
  Draft: 10,
  Rejected: 20,
  Submitted: 30,
  Approved: 40,
  Unpublished: 50,
  Published: 60,
} as const;
export type BlogPostStatus = typeof BlogPostStatus;
export type ABlogPostStatus = BlogPostStatus[keyof BlogPostStatus];