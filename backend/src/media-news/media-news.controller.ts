import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMediaNewsDto } from './dto/create-media-new.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateMediaNewsDto } from './dto/update-media-new.dto';
import { MediaNewsService } from './media-news.service';

@ApiTags('Media News')
@Controller('media-news')
export class MediaNewsController {
  constructor(private readonly mediaNewsService: MediaNewsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new media news article',
    description: 'Creates a new media news article with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        urlPath: { type: 'string' },
        externalId: { type: 'string', example: 'abc123' },
        mediaSourceId: { type: 'string', example: 'clm123456789' },
        likeCount: { type: 'number', example: 100 },
        commentCount: { type: 'number', example: 50 },
        shareCount: { type: 'number', example: 25 },
        totalEngagements: { type: 'number', example: 175 },
      },
      required: ['title', 'content', 'urlPath', 'externalId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The media news article has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Media news source not found.' })
  create(@Body() createMediaNewsDto: CreateMediaNewsDto) {
    return this.mediaNewsService.create(createMediaNewsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get news articles with pagination and filtering',
    description:
      'Retrieves news articles with pagination and filtering options',
  })
  @ApiResponse({
    status: 200,
    description: 'List of news articles with pagination and filtering',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.mediaNewsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get news article by ID',
    description: 'Retrieves a specific news article by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'News article ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'News article retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  findOne(@Param('id') id: string) {
    return this.mediaNewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update news article',
    description: 'Updates an existing news article',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        urlPath: { type: 'string' },
        externalId: { type: 'string', example: 'abc123' },
        mediaSourceId: { type: 'string', example: 'clm123456789' },
        likeCount: { type: 'number', example: 100 },
        commentCount: { type: 'number', example: 50 },
        shareCount: { type: 'number', example: 25 },
        totalEngagements: { type: 'number', example: 175 },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'News article ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'News article updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateMediaNewsDto: UpdateMediaNewsDto,
  ) {
    return this.mediaNewsService.update(id, updateMediaNewsDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete news article',
    description: 'Deletes a news article',
  })
  @ApiParam({
    name: 'id',
    description: 'News article ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 204,
    description: 'News article deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  remove(@Param('id') id: string) {
    return this.mediaNewsService.remove(id);
  }
}
