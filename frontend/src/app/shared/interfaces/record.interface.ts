export interface Record {
  id: string;
  title: string;
  description: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
  popularityScore?: number;
  sportId: string;
  contentTypeId: string;
  competitionId?: string;
  nationalTeamId?: string;
}

export interface CreateRecordDto {
  title: string;
  description: string;
  date?: Date;
  sportId: string;
  contentTypeId: string;
  competitionId?: string;
  nationalTeamId?: string;
}

export interface UpdateRecordDto {
  title?: string;
  description?: string;
  date?: Date;
  sportId?: string;
  contentTypeId?: string;
  competitionId?: string;
  nationalTeamId?: string;
}

export interface FormState {
  title: string;
  description: string;
  date: Date;
  sportId: string;
  contentTypeId: string;
  competitionId: string;
  nationalTeamId: string;
}

export interface RecordResponse {
  data: Record[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
