import { PartialType } from '@nestjs/mapped-types';
import { CreateSportDto } from './create-sport.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSportDto extends PartialType(CreateSportDto) {
  @IsString()
  @IsOptional()
  name?: string;
}
