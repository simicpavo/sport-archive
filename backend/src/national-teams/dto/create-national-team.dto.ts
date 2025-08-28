import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNationalTeamDto {
  @ApiProperty({ example: 'Spain' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sportId' })
  @IsString()
  @IsNotEmpty()
  sportId: string;
}
