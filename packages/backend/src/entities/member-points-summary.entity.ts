import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Shop } from './shop.entity';
import { Member } from './member.entity';

@Entity('member_points_summary')
@Index(['shopId', 'memberId'], { unique: true })
export class MemberPointsSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  shopId: number;

  @Column({ type: 'int' })
  memberId: number;

  @Column({ type: 'int', default: 0 })
  currentPoints: number;

  @Column({ type: 'int', default: 0 })
  totalEarned: number;

  @Column({ type: 'int', default: 0 })
  totalUsed: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Shop, shop => shop.pointsSummaries)
  shop: Shop;

  @ManyToOne(() => Member, member => member.pointsSummary)
  member: Member;
}