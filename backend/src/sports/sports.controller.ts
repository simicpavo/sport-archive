import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sports')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all sports',
    description: 'Returns all sports ordered by name.',
  })
  @ApiResponse({ status: 200, description: 'List of sports returned.' })
  findAll() {
    return this.sportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a sport by id',
    description: 'Returns a sport by its id.',
  })
  @ApiParam({ name: 'id', description: 'Sport ID (cuid string)' })
  @ApiResponse({ status: 200, description: 'Sport returned.' })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  findOne(@Param('id') id: string) {
    return this.sportsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a sport',
    description: 'Creates a new sport with the given name.',
  })
  @ApiResponse({ status: 201, description: 'Sport created.' })
  @ApiResponse({ status: 409, description: 'Sport name already exists.' })
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.create(createSportDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a sport',
    description: 'Updates a sport by its id with the given name.',
  })
  @ApiParam({ name: 'id', description: 'Sport ID (cuid string)' })
  @ApiResponse({ status: 200, description: 'Sport updated.' })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  @ApiResponse({ status: 409, description: 'Sport name already exists.' })
  update(@Param('id') id: string, @Body() updateSportDto: UpdateSportDto) {
    return this.sportsService.update(id, updateSportDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a sport',
    description: 'Deletes a sport by its id.',
  })
  @ApiParam({ name: 'id', description: 'Sport ID (cuid string)' })
  @ApiResponse({ status: 200, description: 'Sport deleted.' })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  remove(@Param('id') id: string) {
    return this.sportsService.remove(id);
  }
}
