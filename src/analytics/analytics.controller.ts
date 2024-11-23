import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { AddViewDto } from './dto/add-view.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async addView(@Req() req: AuthRequest, @Body() addViewDto: AddViewDto) {
    return await this.analyticsService.addView(req.user, addViewDto);
  }
}
