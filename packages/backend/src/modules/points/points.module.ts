import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberPointsSummary } from '../../entities/member-points-summary.entity';
import { MemberPointsTransaction } from '../../entities/member-points-transaction.entity';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemberPointsSummary, MemberPointsTransaction])],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}