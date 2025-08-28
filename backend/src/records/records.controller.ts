import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new record',
    description:
      'Create a new record with title, description, sport, content type, and optional relations',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Greatest Tennis Match Ever' },
        description: {
          type: 'string',
          example: 'An epic match between two tennis legends',
        },
        date: { type: 'string', format: 'date', example: '2024-07-14' },
        sportId: { type: 'string', example: 'sportId' },
        contentTypeId: { type: 'string', example: 'contentTypeId' },
        competitionId: { type: 'string', example: 'competitionId' },
        nationalTeamId: { type: 'string', example: 'nationalTeamId' },
        popularityScore: { type: 'number', example: 0.0 },
        personIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['personId1', 'personId2'],
        },
        clubIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['clubId1', 'clubId2'],
        },
      },
      required: ['title', 'description', 'sportId', 'contentTypeId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 404,
    description:
      'Sport, ContentType, Competition, NationalTeam, Person, or Club not found.',
  })
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all records',
    description: 'Get a list of all records with their related data',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of records has been successfully retrieved.',
  })
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a record by ID',
    description:
      'Retrieve a record by its unique identifier with all related data',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the record',
    example: 'recordId',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a record by ID',
    description:
      'Update a record with the given data. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the record to update',
    example: 'recordId',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Tennis Match Title' },
        description: {
          type: 'string',
          example: 'Updated description of the epic match',
        },
        date: { type: 'string', format: 'date', example: '2024-07-15' },
        sportId: { type: 'string', example: 'newSportId' },
        contentTypeId: { type: 'string', example: 'newContentTypeId' },
        competitionId: { type: 'string', example: 'newCompetitionId' },
        nationalTeamId: { type: 'string', example: 'newNationalTeamId' },
        popularityScore: { type: 'number', example: 5.0 },
        personIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['newPersonId1', 'newPersonId2'],
        },
        clubIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['newClubId1', 'newClubId2'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 404,
    description:
      'Record, Sport, ContentType, Competition, NationalTeam, Person, or Club not found.',
  })
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a record by ID',
    description: 'Remove a record with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the record to delete',
    example: 'recordId',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
