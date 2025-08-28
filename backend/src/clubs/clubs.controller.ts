import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new club',
    description: 'Create a new club with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Real Madrid' },
        sportId: { type: 'string', example: 'sportId' },
      },
      required: ['name', 'sportId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The club has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all clubs',
    description: 'Get a list of all clubs',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of clubs has been successfully retrieved.',
  })
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a club by ID',
    description: 'Retrieve a club by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The club has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Club not found.' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a club by ID',
    description: 'Update a club with the given data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Real Madrid' },
        sportId: { type: 'string', example: 'sportId' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The club has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Club not found.' })
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a club by ID',
    description: 'Remove a club with the given ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The club has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Club not found.' })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }
}
