import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../../entities/shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepo: Repository<Shop>,
  ) {}

  async create(createShopDto: Partial<Shop>) {
    const shop = this.shopRepo.create(createShopDto);
    return this.shopRepo.save(shop);
  }

  async findAll(merchantId?: number) {
    const where = merchantId ? { merchantId } : {};
    return this.shopRepo.find({
      where,
      relations: ['stores', 'merchant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.shopRepo.findOne({
      where: { id },
      relations: ['stores', 'merchant'],
    });
  }

  async update(id: number, updateShopDto: Partial<Shop>) {
    await this.shopRepo.update(id, updateShopDto);
    return this.shopRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.shopRepo.delete(id);
  }
}