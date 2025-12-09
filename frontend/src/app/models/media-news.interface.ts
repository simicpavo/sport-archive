export interface MediaNews {
  id: string;
  title: string;
  content: string;
  urlPath: string;
  externalId: string;
  mediaSourceId?: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  totalEngagements: number;
  createdAt: string;
  updatedAt: string;
  mediaSource?: MediaSource;
}

export interface MediaSource {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMediaNews {
  data: MediaNews[];
  meta?: {
    total: number;
    page: number;
    take: number;
    totalPages: number;
  };
}

export interface MediaNewsFilters {
  page?: number;
  take?: number;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  sortBy?: 'totalEngagements' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export type TimeFilter = '6h' | '12h' | '24h' | 'recent';
