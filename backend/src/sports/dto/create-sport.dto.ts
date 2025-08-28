import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSportDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
