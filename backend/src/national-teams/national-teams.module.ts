import { Module } from '@nestjs/common';
import { NationalTeamsService } from './national-teams.service';
import { NationalTeamsController } from './national-teams.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [NationalTeamsController],
  providers: [NationalTeamsService],
  imports: [PrismaModule],
})
export class NationalTeamsModule {}
