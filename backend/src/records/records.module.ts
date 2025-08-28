import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [PrismaModule],
})
export class RecordsModule {}
