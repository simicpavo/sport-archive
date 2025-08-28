import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';
import { PersonsModule } from './persons/persons.module';
import { ClubsModule } from './clubs/clubs.module';
import { NationalTeamsModule } from './national-teams/national-teams.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ContentTypesModule } from './content-types/content-types.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    PrismaModule,
    SportsModule,
    PersonsModule,
    ClubsModule,
    NationalTeamsModule,
    CompetitionsModule,
    ContentTypesModule,
    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
