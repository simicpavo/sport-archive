import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMediaNewsDto {
  @ApiProperty({
    description: 'Article title',
    example: 'Croatia beats Brazil 3-0 in World Cup semifinal',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Article content or summary',
    example: 'Croatia secured their place in the World Cup final...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'URL path to the article',
    example: '/sport/nogomet/hrvatska-brazil-3-0',
  })
  @IsString()
  @IsNotEmpty()
  urlPath: string;

  @ApiProperty({
    description: 'External ID from the source website',
    example: 'article-123456',
  })
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @ApiProperty({
    description: 'Media source ID',
    example: 'clm123456789',
  })
  @IsString()
  @IsOptional()
  mediaSourceId?: string;

  @ApiProperty({
    description: 'Number of likes',
    example: 150,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  likeCount?: number;

  @ApiProperty({
    description: 'Number of shares',
    example: 45,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  shareCount?: number;

  @ApiProperty({
    description: 'Number of comments',
    example: 32,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  commentCount?: number;

  @ApiProperty({
    description: 'Total engagement count',
    example: 227,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalEngagements?: number;
}
