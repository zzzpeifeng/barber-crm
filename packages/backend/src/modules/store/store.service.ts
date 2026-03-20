import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {}

  async create(createStoreDto: Partial<Store>) {
    const store = this.storeRepo.create(createStoreDto);
    return this.storeRepo.save(store);
  }

  async findAll(shopId?: number) {
    const where = shopId ? { shopId } : {};
    const stores = await this.storeRepo.find({
      where,
      relations: ['shop', 'shop.merchant'],
      select: {
        id: true,
        shopId: true,
        name: true,
        address: true,
        phone: true,
        remark: true,
        createdAt: true,
        updatedAt: true,
        shop: {
          id: true,
          name: true,
          merchantId: true,
          merchant: {
            id: true,
            name: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });

    // 返回时将 shop.name 和 shop.merchant.name 展平
    return stores.map(store => ({
      id: store.id,
      shopId: store.shopId,
      name: store.name,
      address: store.address,
      phone: store.phone,
      remark: store.remark,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      shopName: store.shop.name,
      merchantId: store.shop.merchantId,
      merchantName: store.shop.merchant.name,
    }));
  }

  async findOne(id: number) {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['shop', 'shop.merchant'],
      select: {
        id: true,
        shopId: true,
        name: true,
        address: true,
        phone: true,
        remark: true,
        createdAt: true,
        updatedAt: true,
        shop: {
          id: true,
          name: true,
          merchantId: true,
          merchant: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!store) return null;

    // 返回展平的数据结构
    return {
      id: store.id,
      shopId: store.shopId,
      name: store.name,
      address: store.address,
      phone: store.phone,
      remark: store.remark,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      shopName: store.shop.name,
      merchantName: store.shop.merchant.name,
    };
  }

  async update(id: number, updateStoreDto: Partial<Store>) {
    await this.storeRepo.update(id, updateStoreDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.storeRepo.delete(id);
  }
}