import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity('merchant_user')
export class MerchantUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  merchantId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ 
    type: 'enum', 
    enum: ['owner', 'manager', 'staff']
  })
  role: 'owner' | 'manager' | 'staff';

  @Column({ type: 'varchar', length: 50, nullable: true })
  realName: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Merchant, merchant => merchant.users)
  merchant: Merchant;
}