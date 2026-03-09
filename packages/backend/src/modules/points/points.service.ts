import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberPointsSummary } from '../../entities/member-points-summary.entity';
import { MemberPointsTransaction } from '../../entities/member-points-transaction.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(MemberPointsSummary)
    private pointsSummaryRepo: Repository<MemberPointsSummary>,
    @InjectRepository(MemberPointsTransaction)
    private pointsTransactionRepo: Repository<MemberPointsTransaction>,
  ) {}

  async getPointsSummary(memberId: number, shopId: number) {
    return this.pointsSummaryRepo.findOne({
      where: { memberId, shopId },
      relations: ['member', 'shop'],
    });
  }

  async getPointsTransactions(memberId?: number, shopId?: number) {
    const where: any = {};
    if (memberId) where.memberId = memberId;
    if (shopId) where.shopId = shopId;

    return this.pointsTransactionRepo.find({
      where,
      relations: ['member', 'shop'],
      order: { createdAt: 'DESC' },
    });
  }

  async changePoints(data: {
    memberId: number;
    shopId: number;
    changeType: 'increase' | 'decrease' | 'reset';
    pointsChange: number;
    reason?: string;
    operatorId: number;
  }) {
    // 获取或创建积分汇总
    let summary = await this.pointsSummaryRepo.findOne({
      where: { memberId: data.memberId, shopId: data.shopId },
    });

    if (!summary) {
      summary = this.pointsSummaryRepo.create({
        memberId: data.memberId,
        shopId: data.shopId,
        currentPoints: 0,
        totalEarned: 0,
        totalUsed: 0,
      });
      await this.pointsSummaryRepo.save(summary);
    }

    // 更新积分汇总
    if (data.changeType === 'increase') {
      summary.currentPoints += data.pointsChange;
      summary.totalEarned += data.pointsChange;
    } else if (data.changeType === 'decrease') {
      if (summary.currentPoints < data.pointsChange) {
        throw new Error('积分不足');
      }
      summary.currentPoints -= data.pointsChange;
      summary.totalUsed += data.pointsChange;
    } else if (data.changeType === 'reset') {
      summary.currentPoints = data.pointsChange;
      summary.totalEarned = data.pointsChange;
      summary.totalUsed = 0;
    }

    await this.pointsSummaryRepo.save(summary);

    // 创建变更记录
    const transaction = this.pointsTransactionRepo.create({
      memberId: data.memberId,
      shopId: data.shopId,
      changeType: data.changeType,
      pointsChange: data.pointsChange,
      reason: data.reason,
      operatorId: data.operatorId,
    });

    return this.pointsTransactionRepo.save(transaction);
  }
}