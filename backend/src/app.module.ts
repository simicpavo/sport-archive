import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';
import { PersonsModule } from './persons/persons.module';
import { ClubsModule } from './clubs/clubs.module';

@Module({
  imports: [PrismaModule, SportsModule, PersonsModule, ClubsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
