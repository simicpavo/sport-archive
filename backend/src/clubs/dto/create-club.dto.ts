import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubDto {
  @ApiProperty({ example: 'Real Madrid' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ckx123sportId' })
  @IsString()
  @IsNotEmpty()
  sportId: string;
}
