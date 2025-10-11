export interface Club {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sportId: string;
}

export interface CreateClubDto {
  name: string;
  sportId: string;
}
export interface UpdateClubDto {
  name?: string;
  sportId?: string;
}

export interface ClubResponse {
  data: Club[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
