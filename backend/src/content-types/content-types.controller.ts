import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentTypesService } from './content-types.service';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Content Types')
@Controller('content-types')
export class ContentTypesController {
  constructor(private readonly contentTypesService: ContentTypesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new content type',
    description: 'Creates a new content type with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Article' },
      },
      required: ['name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The content type has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createContentTypeDto: CreateContentTypeDto) {
    return this.contentTypesService.create(createContentTypeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all content types',
    description: 'Retrieves a list of all content types',
  })
  @ApiResponse({
    status: 200,
    description: 'List of content types returned.',
  })
  findAll() {
    return this.contentTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a content type by ID',
    description: 'Retrieves a content type by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The content type has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Content type not found.' })
  findOne(@Param('id') id: string) {
    return this.contentTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a content type by ID',
    description:
      'Updates the details of a content type by its unique identifier',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Article' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The content type has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Content type not found.' })
  update(
    @Param('id') id: string,
    @Body() updateContentTypeDto: UpdateContentTypeDto,
  ) {
    return this.contentTypesService.update(id, updateContentTypeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a content type by ID',
    description: 'Removes a content type with the given ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The content type has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Content type not found.' })
  remove(@Param('id') id: string) {
    return this.contentTypesService.remove(id);
  }
}
