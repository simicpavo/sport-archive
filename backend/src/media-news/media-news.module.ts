import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaNewsController } from './media-news.controller';
import { MediaNewsService } from './media-news.service';

@Module({
  controllers: [MediaNewsController],
  providers: [MediaNewsService, PrismaService],
  imports: [PrismaModule],
  exports: [MediaNewsService],
})
export class MediaNewsModule {}
