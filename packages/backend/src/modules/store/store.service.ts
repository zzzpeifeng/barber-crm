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
    return this.storeRepo.find({
      where,
      relations: ['shop'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.storeRepo.findOne({
      where: { id },
      relations: ['shop'],
    });
  }

  async update(id: number, updateStoreDto: Partial<Store>) {
    await this.storeRepo.update(id, updateStoreDto);
    return this.storeRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.storeRepo.delete(id);
  }
}