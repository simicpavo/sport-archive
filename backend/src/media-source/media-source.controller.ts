import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMediaSourceDto } from './dto/create-media-source.dto';
import { UpdateMediaSourceDto } from './dto/update-media-source.dto';
import { MediaSourceService } from './media-source.service';

@ApiTags('Media Sources')
@Controller('media-sources')
export class MediaSourceController {
  constructor(private readonly mediaSourceService: MediaSourceService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new media source',
    description: 'Creates a new media source with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'YouTube' },
        baseUrl: { type: 'string', example: 'https://www.youtube.com/' },
        urlPath: {
          type: 'string',
          example: '/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw',
        },
      },
      required: ['name', 'baseUrl'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The media source has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 409,
    description: 'Media source with this name already exists.',
  })
  create(@Body() createMediaSourceDto: CreateMediaSourceDto) {
    return this.mediaSourceService.create(createMediaSourceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all media sources',
    description: 'Retrieves a list of all media sources',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of media sources has been successfully retrieved.',
  })
  findAll() {
    return this.mediaSourceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a media source by ID',
    description: 'Retrieves a media source by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Media source ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'The media source has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Media source not found.' })
  findOne(@Param('id') id: string) {
    return this.mediaSourceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a media source by ID',
    description:
      'Updates the details of a media source by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Media source ID',
    example: 'clm123456789',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'YouTube' },
        baseUrl: { type: 'string', example: 'https://www.youtube.com/' },
        urlPath: {
          type: 'string',
          example: '/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The media source has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Media source not found.' })
  @ApiResponse({
    status: 409,
    description: 'Media source with this ID already exists.',
  })
  update(
    @Param('id') id: string,
    @Body() updateMediaSourceDto: UpdateMediaSourceDto,
  ) {
    return this.mediaSourceService.update(id, updateMediaSourceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a media source by ID',
    description: 'Deletes a media source by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Media source ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'The media source has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Media source not found.' })
  remove(@Param('id') id: string) {
    return this.mediaSourceService.remove(id);
  }
}
