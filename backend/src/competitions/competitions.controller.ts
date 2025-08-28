import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { ApiResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new competition',
    description: 'Create a new competition with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Wimbledon' },
        sportId: { type: 'string', example: 'sportId' },
      },
      required: ['name', 'sportId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The competition has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all competitions',
    description: 'Retrieve a list of all competitions',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all competitions has been successfully retrieved.',
  })
  findAll() {
    return this.competitionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a competition by ID',
    description: 'Retrieve a competition by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The competition has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Competition not found.' })
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a competition by ID',
    description: 'Update a competition by its unique identifier',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'New Wimbledon' },
        sportId: { type: 'string', example: 'sportId' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The competition has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Competition not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a competition by ID',
    description: 'Delete a competition by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The competition has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Competition not found.' })
  remove(@Param('id') id: string) {
    return this.competitionsService.remove(id);
  }
}
