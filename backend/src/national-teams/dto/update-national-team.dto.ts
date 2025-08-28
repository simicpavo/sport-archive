import { PartialType } from '@nestjs/mapped-types';
import { CreateNationalTeamDto } from './create-national-team.dto';

export class UpdateNationalTeamDto extends PartialType(CreateNationalTeamDto) {}
