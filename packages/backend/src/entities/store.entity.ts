import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Shop } from './shop.entity';
import { MemberStoreLog } from './member-store-log.entity';

@Entity('store')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  shopId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Shop, shop => shop.stores)
  shop: Shop;

  @OneToMany(() => MemberStoreLog, log => log.store)
  memberLogs: MemberStoreLog[];
}