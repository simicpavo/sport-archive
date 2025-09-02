/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MediaJobService } from './media-job/media-job.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MediaJobService, PrismaService],
})
export class CronModule {}
