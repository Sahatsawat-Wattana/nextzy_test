import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('game')
@Controller()
export class GameController {
  constructor(private readonly game: GameService) {}
  @Get('health') @ApiOperation({ summary: 'Check API health' }) health() { return { status: 'ok' }; }
  @Get('player') @ApiOperation({ summary: 'Get score and histories' }) state() { return this.game.getState(); }
  @Post('game/play') @ApiOperation({ summary: 'Play and earn a random score' }) play() { return this.game.play(); }
  @Post('rewards/:checkpoint/claim') @ApiOperation({ summary: 'Claim an unlocked reward once' }) claim(@Param('checkpoint', ParseIntPipe) checkpoint: number) { return this.game.claim(checkpoint); }
  @Post('reset') @ApiOperation({ summary: 'Reset score and histories' }) reset() { return this.game.reset(); }
}
