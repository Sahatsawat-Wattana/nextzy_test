import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import {
  cappedScore,
  hasReachedMaxScore,
  PLAYER_ID,
  REWARDS,
  SCORE_OPTIONS,
} from './game.constants';
import { PrismaService } from './prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  private ensurePlayer() {
    return this.prisma.player.upsert({
      where: { id: PLAYER_ID },
      update: {},
      create: { id: PLAYER_ID },
    });
  }

  async getState() {
    await this.ensurePlayer();
    return this.prisma.player.findUniqueOrThrow({
      where: { id: PLAYER_ID },
      include: {
        plays: { orderBy: { createdAt: 'desc' } },
        rewards: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async play() {
    await this.ensurePlayer();

    return this.prisma.$transaction(async (tx) => {
      const player = await tx.player.findUniqueOrThrow({ where: { id: PLAYER_ID } });
      if (hasReachedMaxScore(player.score)) {
        throw new ConflictException(
          'คะแนนสะสมครบ 10,000 แล้ว กรุณารับรางวัลหรือรีเซตเพื่อเล่นใหม่',
        );
      }

      const earned = SCORE_OPTIONS[Math.floor(Math.random() * SCORE_OPTIONS.length)];
      const score = cappedScore(player.score, earned);

      await tx.playHistory.create({
        data: { score: earned, playerId: PLAYER_ID },
      });
      await tx.player.update({
        where: { id: PLAYER_ID },
        data: { score },
      });

      return { earned, score };
    });
  }

  async claim(checkpoint: number) {
    const rewardName = REWARDS[checkpoint];
    if (!rewardName) {
      throw new BadRequestException('Invalid checkpoint');
    }

    await this.ensurePlayer();

    return this.prisma.$transaction(async (tx) => {
      const player = await tx.player.findUniqueOrThrow({ where: { id: PLAYER_ID } });
      if (player.score < checkpoint) {
        throw new BadRequestException('Checkpoint has not been reached');
      }

      const claimed = await tx.rewardHistory.findUnique({ where: { checkpoint } });
      if (claimed) {
        throw new ConflictException('Reward has already been claimed');
      }

      return tx.rewardHistory.create({
        data: { checkpoint, rewardName, playerId: PLAYER_ID },
      });
    });
  }

  async reset() {
    await this.ensurePlayer();
    await this.prisma.$transaction([
      this.prisma.playHistory.deleteMany({ where: { playerId: PLAYER_ID } }),
      this.prisma.rewardHistory.deleteMany({ where: { playerId: PLAYER_ID } }),
      this.prisma.player.update({
        where: { id: PLAYER_ID },
        data: { score: 0 },
      }),
    ]);

    return { score: 0 };
  }
}
