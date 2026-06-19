import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] })],
  controllers: [GameController],
  providers: [GameService, PrismaService],
})
export class AppModule {}
