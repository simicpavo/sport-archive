import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './chron/chron.module';
import { ClubsModule } from './clubs/clubs.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ContentTypesModule } from './content-types/content-types.module';
import { NationalTeamsModule } from './national-teams/national-teams.module';
import { PersonsModule } from './persons/persons.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordsModule } from './records/records.module';
import { SportsModule } from './sports/sports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    SportsModule,
    PersonsModule,
    ClubsModule,
    NationalTeamsModule,
    CompetitionsModule,
    ContentTypesModule,
    RecordsModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
