import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Shop } from './shop.entity';
import { MemberPointsSummary } from './member-points-summary.entity';
import { MemberPointsTransaction } from './member-points-transaction.entity';
import { MemberStoreLog } from './member-store-log.entity';

@Entity('member')
@Index(['shopId', 'phone'], { unique: true })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  shopId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Shop, shop => shop.members)
  shop: Shop;

  @OneToMany(() => MemberPointsSummary, summary => summary.member)
  pointsSummary: MemberPointsSummary[];

  @OneToMany(() => MemberPointsTransaction, transaction => transaction.member)
  pointsTransactions: MemberPointsTransaction[];

  @OneToMany(() => MemberStoreLog, log => log.member)
  storeLogs: MemberStoreLog[];
}