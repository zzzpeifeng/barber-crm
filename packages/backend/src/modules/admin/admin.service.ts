import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../../entities/admin-user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepo: Repository<AdminUser>,
  ) {}

  async findAll() {
    return this.adminUserRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.adminUserRepo.findOne({
      where: { id },
    });
  }

  async updateLastLogin(id: number) {
    await this.adminUserRepo.update(id, { lastLoginAt: new Date() });
  }
}