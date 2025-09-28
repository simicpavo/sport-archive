export interface ContentType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContentTypeDto {
  name: string;
}

export interface UpdateContentTypeDto {
  name?: string;
}

export interface FormState {
  name: string;
}

export interface ContentTypeResponse {
  data: ContentType[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
