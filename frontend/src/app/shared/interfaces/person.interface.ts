export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  birthDate: Date;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonDto {
  firstName: string;
  lastName: string;
  nickname?: string;
  birthDate: Date;
  nationality: string;
}

export interface UpdatePersonDto {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  birthDate?: Date;
  nationality?: string;
}

export interface FormState {
  firstName: string;
  lastName: string;
  nickname: string;
  birthDate: Date;
  nationality: string;
}

export interface PersonResponse {
  data: Person[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    take: number;
  };
}
