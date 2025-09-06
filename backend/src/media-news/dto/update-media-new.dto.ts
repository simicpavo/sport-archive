import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaNewsDto } from './create-media-new.dto';

export class UpdateMediaNewsDto extends PartialType(CreateMediaNewsDto) {}
