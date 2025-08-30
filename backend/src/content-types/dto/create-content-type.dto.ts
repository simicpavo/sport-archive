import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContentTypeDto {
  @ApiProperty({ example: 'Article' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
