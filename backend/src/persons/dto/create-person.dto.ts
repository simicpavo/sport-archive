import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({ example: 'Roger' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Federer' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'Fed' })
  @IsString()
  @IsOptional()
  nickname?: string;

  // Accept "YYYY-MM-DD"
  @ApiProperty({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 'Swiss' })
  @IsString()
  @IsNotEmpty()
  nationality: string;
}
