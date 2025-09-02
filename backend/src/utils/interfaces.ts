export interface Article {
  title: string;
  content: string;
  urlPath: string;
  externalId: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  totalEngagements: number;
}

export interface MediaSource {
  id: string;
  baseUrl: string;
  urlPath?: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
