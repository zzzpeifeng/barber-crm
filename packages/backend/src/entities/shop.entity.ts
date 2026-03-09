import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Merchant } from './merchant.entity';
import { Store } from './store.entity';
import { Member } from './member.entity';
import { MemberPointsSummary } from './member-points-summary.entity';
import { MemberPointsTransaction } from './member-points-transaction.entity';
import { MemberStoreLog } from './member-store-log.entity';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  merchantId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Merchant, merchant => merchant.shops)
  merchant: Merchant;

  @OneToMany(() => Store, store => store.shop)
  stores: Store[];

  @OneToMany(() => Member, member => member.shop)
  members: Member[];

  @OneToMany(() => MemberPointsSummary, summary => summary.shop)
  pointsSummaries: MemberPointsSummary[];

  @OneToMany(() => MemberPointsTransaction, transaction => transaction.shop)
  pointsTransactions: MemberPointsTransaction[];

  @OneToMany(() => MemberStoreLog, log => log.shop)
  storeLogs: MemberStoreLog[];
}