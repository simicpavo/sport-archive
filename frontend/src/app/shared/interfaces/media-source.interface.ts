export interface MediaSource {
  id: string;
  baseUrl: string;
  urlPath?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMediaSourceDto {
  baseUrl: string;
  urlPath?: string;
  name: string;
}

export interface UpdateMediaSourceDto {
  baseUrl?: string;
  urlPath?: string;
  name?: string;
}

export interface FormState {
  baseUrl: string;
  urlPath: string;
  name: string;
}

export interface MediaSourceResponse {
  data: MediaSource[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
