import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
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
