import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  imports: [PrismaModule],
})
export class CompetitionsModule {}
