export interface NationalTeam {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sportId: string;
}

export interface CreateNationalTeamDto {
  name: string;
  sportId: string;
}

export interface UpdateNationalTeamDto {
  name?: string;
  sportId?: string;
}

export interface FormState {
  name: string;
  sportId: string;
}

export interface NationalTeamResponse {
  data: NationalTeam[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
