export interface Competition {
  id: string;
  name: string;
  season?: string;
  startDate?: Date;
  endDate?: Date;
  sportId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompetitionDto {
  name: string;
  season?: string;
  startDate?: Date;
  endDate?: Date;
  sportId: string;
}

export interface UpdateCompetitionDto {
  name?: string;
  season?: string;
  startDate?: Date;
  endDate?: Date;
  sportId?: string;
}

export interface CompetitionResponse {
  data: Competition[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
