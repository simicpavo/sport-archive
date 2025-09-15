import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaSourceDto } from './create-media-source.dto';

export class UpdateMediaSourceDto extends PartialType(CreateMediaSourceDto) {}
