import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { Member } from './member.entity';

@Entity('member_points_transaction')
export class MemberPointsTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  shopId: number;

  @Column({ type: 'int' })
  memberId: number;

  @Column({ 
    type: 'enum', 
    enum: ['increase', 'decrease', 'reset']
  })
  changeType: 'increase' | 'decrease' | 'reset';

  @Column({ type: 'int' })
  pointsChange: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ type: 'int' })
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Shop, shop => shop.pointsTransactions)
  shop: Shop;

  @ManyToOne(() => Member, member => member.pointsTransactions)
  member: Member;
}