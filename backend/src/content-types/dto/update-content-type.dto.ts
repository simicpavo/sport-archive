import { PartialType } from '@nestjs/mapped-types';
import { CreateContentTypeDto } from './create-content-type.dto';

export class UpdateContentTypeDto extends PartialType(CreateContentTypeDto) {}
