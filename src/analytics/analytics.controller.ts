import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // resume all the events of the organizer
  @Get()
  getAllStats(@CurrentUser() user: any) {
    return this.analyticsService.getAllEventsStats(user.id);
  }

  // details of an specific event
  @Get(':eventId')
  getEventStats(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getEventStats(eventId, user.id);
  }
}