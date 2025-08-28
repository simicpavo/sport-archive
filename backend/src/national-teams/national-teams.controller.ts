import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NationalTeamsService } from './national-teams.service';
import { CreateNationalTeamDto } from './dto/create-national-team.dto';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('National Teams')
@Controller('national-teams')
export class NationalTeamsController {
  constructor(private readonly nationalTeamsService: NationalTeamsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new national team',
    description: 'Create a new national team with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Spain' },
        sportId: { type: 'string', example: 'sportId' },
      },
      required: ['name', 'sportId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The national team has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createNationalTeamDto: CreateNationalTeamDto) {
    return this.nationalTeamsService.create(createNationalTeamDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all national teams',
    description: 'Get a list of all national teams',
  })
  @ApiResponse({
    status: 200,
    description: 'List of national teams',
  })
  findAll() {
    return this.nationalTeamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a national team by ID',
    description: 'Retrieve a national team by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The national team has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'National team not found.' })
  findOne(@Param('id') id: string) {
    return this.nationalTeamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a national team by ID',
    description:
      'Update the details of a national team by its unique identifier',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated National Team Name' },
        sportId: { type: 'string', example: 'newSportId' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The national team has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'National team not found.' })
  update(
    @Param('id') id: string,
    @Body() updateNationalTeamDto: UpdateNationalTeamDto,
  ) {
    return this.nationalTeamsService.update(id, updateNationalTeamDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a national team by ID',
    description: 'Remove a national team with the given ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The national team has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'National team not found.' })
  remove(@Param('id') id: string) {
    return this.nationalTeamsService.remove(id);
  }
}
