import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaSourceController } from './media-source.controller';
import { MediaSourceService } from './media-source.service';

@Module({
  controllers: [MediaSourceController],
  providers: [MediaSourceService],
  imports: [PrismaModule],
  exports: [MediaSourceService],
})
export class MediaSourceModule {}
