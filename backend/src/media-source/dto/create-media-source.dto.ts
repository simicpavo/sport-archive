import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMediaSourceDto {
  @ApiProperty({
    description: 'Base URL of the media source',
    example: 'https://www.index.hr',
  })
  @IsUrl({}, { message: 'Base URL must be a valid URL' })
  @IsNotEmpty()
  baseUrl: string;

  @ApiProperty({
    description: 'Optional URL path for specific sections',
    example: 'sport',
    required: false,
  })
  @IsOptional()
  @IsString()
  urlPath?: string;

  @ApiProperty({
    description: 'Name identifier for the media source',
    example: 'INDEX_HR',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
