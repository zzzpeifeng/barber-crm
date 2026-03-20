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
    const shops = await this.shopRepo.find({
      where,
      relations: ['merchant'],
      select: {
        id: true,
        merchantId: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        merchant: {
          id: true,
          name: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    // 返回时将 merchant.name 展平
    return shops.map(shop => ({
      id: shop.id,
      merchantId: shop.merchantId,
      name: shop.name,
      description: shop.description,
      createdAt: shop.createdAt,
      updatedAt: shop.updatedAt,
      merchantName: shop.merchant.name,
    }));
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