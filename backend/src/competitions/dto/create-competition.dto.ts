import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompetitionDto {
  @ApiProperty({ example: 'Wimbledon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '2023' })
  @IsString()
  @IsNotEmpty()
  season: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1981-08-28' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 'sportId' })
  @IsString()
  @IsNotEmpty()
  sportId: string;
}
