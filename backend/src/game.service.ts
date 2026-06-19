import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { cappedScore, REWARDS, SCORE_OPTIONS } from './game.constants';
import { PrismaService } from './prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  private ensurePlayer() {
    return this.prisma.player.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  }

  async getState() {
    await this.ensurePlayer();
    return this.prisma.player.findUniqueOrThrow({
      where: { id: 1 },
      include: { plays: { orderBy: { createdAt: 'desc' } }, rewards: { orderBy: { createdAt: 'desc' } } },
    });
  }

  async play() {
    await this.ensurePlayer();
    const earned = SCORE_OPTIONS[Math.floor(Math.random() * SCORE_OPTIONS.length)];
    return this.prisma.$transaction(async (tx) => {
      const player = await tx.player.findUniqueOrThrow({ where: { id: 1 } });
      const score = cappedScore(player.score, earned);
      await tx.playHistory.create({ data: { score: earned, playerId: 1 } });
      await tx.player.update({ where: { id: 1 }, data: { score } });
      return { earned, score };
    });
  }

  async claim(checkpoint: number) {
    const rewardName = REWARDS[checkpoint];
    if (!rewardName) throw new BadRequestException('Invalid checkpoint');
    await this.ensurePlayer();
    return this.prisma.$transaction(async (tx) => {
      const player = await tx.player.findUniqueOrThrow({ where: { id: 1 } });
      if (player.score < checkpoint) throw new BadRequestException('Checkpoint has not been reached');
      const claimed = await tx.rewardHistory.findUnique({ where: { checkpoint } });
      if (claimed) throw new ConflictException('Reward has already been claimed');
      return tx.rewardHistory.create({ data: { checkpoint, rewardName, playerId: 1 } });
    });
  }

  async reset() {
    await this.ensurePlayer();
    await this.prisma.$transaction([
      this.prisma.playHistory.deleteMany({ where: { playerId: 1 } }),
      this.prisma.rewardHistory.deleteMany({ where: { playerId: 1 } }),
      this.prisma.player.update({ where: { id: 1 }, data: { score: 0 } }),
    ]);
    return { score: 0 };
  }
}
