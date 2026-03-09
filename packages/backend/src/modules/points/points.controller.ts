import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';

@Controller('points')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('summary')
  @Roles('super_admin', 'owner', 'manager', 'staff')
  getSummary(@Query('memberId') memberId: number, @Query('shopId') shopId: number) {
    return this.pointsService.getPointsSummary(memberId, shopId);
  }

  @Get('transactions')
  @Roles('super_admin', 'owner', 'manager', 'staff')
  getTransactions(@Query('memberId') memberId?: number, @Query('shopId') shopId?: number) {
    return this.pointsService.getPointsTransactions(memberId, shopId);
  }

  @Post('change')
  @Roles('super_admin', 'owner', 'manager', 'staff')
  changePoints(@Body() data: {
    memberId: number;
    shopId: number;
    changeType: 'increase' | 'decrease' | 'reset';
    pointsChange: number;
    reason?: string;
    operatorId: number;
  }) {
    return this.pointsService.changePoints(data);
  }
}