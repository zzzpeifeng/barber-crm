import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Shop } from './shop.entity';
import { MerchantUser } from './merchant-user.entity';

@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  loginAccount: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Shop, shop => shop.merchant)
  shops: Shop[];

  @OneToMany(() => MerchantUser, user => user.merchant)
  users: MerchantUser[];
}