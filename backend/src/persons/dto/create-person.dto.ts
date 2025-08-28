import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nickname?: string;

  // Accept "YYYY-MM-DD"
  @ApiProperty({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nationality: string;
}
