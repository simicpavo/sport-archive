import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompetitionDto {
  @ApiProperty({ example: 'Wimbledon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '2023' })
  @IsString()
  @IsOptional()
  season?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'sportId' })
  @IsString()
  @IsNotEmpty()
  sportId: string;
}
