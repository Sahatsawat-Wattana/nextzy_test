import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('game')
@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  health() {
    return { status: 'ok' };
  }

  @Get('player')
  @ApiOperation({ summary: 'Get score and histories' })
  getPlayerState() {
    return this.gameService.getState();
  }

  @Post('game/play')
  @ApiOperation({ summary: 'Play and earn a random score' })
  play() {
    return this.gameService.play();
  }

  @Post('rewards/:checkpoint/claim')
  @ApiOperation({ summary: 'Claim an unlocked reward once' })
  claimReward(@Param('checkpoint', ParseIntPipe) checkpoint: number) {
    return this.gameService.claim(checkpoint);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset score and histories' })
  reset() {
    return this.gameService.reset();
  }
}
