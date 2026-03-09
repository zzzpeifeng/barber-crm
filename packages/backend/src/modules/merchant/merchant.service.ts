import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../../entities/merchant.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepo: Repository<Merchant>,
  ) {}

  async create(createMerchantDto: Partial<Merchant>) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createMerchantDto.passwordHash, salt);
    
    const merchant = this.merchantRepo.create({
      ...createMerchantDto,
      passwordHash,
    });
    
    return this.merchantRepo.save(merchant);
  }

  async findAll() {
    return this.merchantRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.merchantRepo.findOne({
      where: { id },
      relations: ['shops', 'users'],
    });
  }

  async update(id: number, updateMerchantDto: Partial<Merchant>) {
    if (updateMerchantDto.passwordHash) {
      const salt = await bcrypt.genSalt();
      updateMerchantDto.passwordHash = await bcrypt.hash(updateMerchantDto.passwordHash, salt);
    }
    
    await this.merchantRepo.update(id, updateMerchantDto);
    return this.merchantRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.merchantRepo.delete(id);
  }
}