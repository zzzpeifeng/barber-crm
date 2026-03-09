import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { Store } from './store.entity';
import { Member } from './member.entity';

@Entity('member_store_log')
export class MemberStoreLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  shopId: number;

  @Column({ type: 'int' })
  storeId: number;

  @Column({ type: 'int' })
  memberId: number;

  @Column({ 
    type: 'enum', 
    enum: ['consume', 'visit']
  })
  actionType: 'consume' | 'visit';

  @Column({ type: 'int', default: 0 })
  pointsChange: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark: string;

  @Column({ type: 'int' })
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Shop, shop => shop.storeLogs)
  shop: Shop;

  @ManyToOne(() => Store, store => store.memberLogs)
  store: Store;

  @ManyToOne(() => Member, member => member.storeLogs)
  member: Member;
}