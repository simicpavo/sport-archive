import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { MediaNewsService } from './media-news.service';

@ApiTags('Media News')
@Controller('media-news')
export class MediaNewsController {
  constructor(private readonly mediaNewsService: MediaNewsService) {}

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
