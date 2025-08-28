import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new person',
    description: 'Create a new person with the given data',
  })
  @ApiResponse({
    status: 201,
    description: 'The person has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all persons',
    description: 'Get a list of all persons',
  })
  @ApiResponse({ status: 200, description: 'The list of persons.' })
  findAll() {
    return this.personsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a person by ID',
    description: 'Get a person by their unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The person with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a person by ID',
    description: 'Update a person by their unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The person has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a person by ID',
    description: 'Delete a person by their unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The person has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  remove(@Param('id') id: string) {
    return this.personsService.remove(id);
  }
}
