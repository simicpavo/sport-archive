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
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nickname?: string;

  // Accept "YYYY-MM-DD"
  @ApiProperty({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nationality: string;
}
