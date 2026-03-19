import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantUser } from '../../entities/merchant-user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantUserService {
  constructor(
    @InjectRepository(MerchantUser)
    private merchantUserRepo: Repository<MerchantUser>,
  ) {}

  async create(createMerchantUserDto: Partial<MerchantUser>) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createMerchantUserDto.passwordHash, salt);
    
    const merchantUser = this.merchantUserRepo.create({
      ...createMerchantUserDto,
      passwordHash,
    });
    
    return this.merchantUserRepo.save(merchantUser);
  }

  async findAll() {
    return this.merchantUserRepo.find({
      relations: ['merchant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.merchantUserRepo.findOne({
      where: { id },
      relations: ['merchant'],
    });
  }

  async update(id: number, updateMerchantUserDto: Partial<MerchantUser>) {
    if (updateMerchantUserDto.passwordHash) {
      const salt = await bcrypt.genSalt();
      updateMerchantUserDto.passwordHash = await bcrypt.hash(updateMerchantUserDto.passwordHash, salt);
    }
    
    await this.merchantUserRepo.update(id, updateMerchantUserDto);
    return this.merchantUserRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.merchantUserRepo.delete(id);
  }
}
