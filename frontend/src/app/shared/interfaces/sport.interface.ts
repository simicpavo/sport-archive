export interface Sport {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSportDto {
  name: string;
}

export interface UpdateSportDto {
  name?: string;
}

export interface SportsResponse {
  data: Sport[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
