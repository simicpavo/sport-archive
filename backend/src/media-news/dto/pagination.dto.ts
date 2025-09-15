import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
  take: number = 10;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  sortBy: 'totalEngagements' | 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc';
}
