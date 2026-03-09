import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  realName: string;

  @Column({ 
    type: 'enum', 
    enum: ['super_admin'],
    default: 'super_admin'
  })
  role: 'super_admin';

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}