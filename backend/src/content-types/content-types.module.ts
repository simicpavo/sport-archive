import { Module } from '@nestjs/common';
import { ContentTypesService } from './content-types.service';
import { ContentTypesController } from './content-types.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ContentTypesController],
  providers: [ContentTypesService],
  imports: [PrismaModule],
})
export class ContentTypesModule {}
