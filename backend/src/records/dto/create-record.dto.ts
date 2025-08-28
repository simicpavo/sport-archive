import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({ example: 'Greatest Tennis Match Ever' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'An epic match between two tennis legends' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2024-07-14' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'sportId' })
  @IsString()
  @IsNotEmpty()
  sportId: string;

  @ApiProperty({ example: 'contentTypeId' })
  @IsString()
  @IsNotEmpty()
  contentTypeId: string;

  @ApiPropertyOptional({ example: 'competitionId' })
  @IsString()
  @IsOptional()
  competitionId?: string;

  @ApiPropertyOptional({ example: 'nationalTeamId' })
  @IsString()
  @IsOptional()
  nationalTeamId?: string;

  @ApiPropertyOptional({ example: 0.0 })
  @IsNumber()
  @IsOptional()
  popularityScore?: number;

  @ApiPropertyOptional({ example: ['personId1', 'personId2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  personIds?: string[];

  @ApiPropertyOptional({ example: ['clubId1', 'clubId2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  clubIds?: string[];
}
