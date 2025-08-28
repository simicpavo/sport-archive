import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';

@Module({
  imports: [PrismaModule, SportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
