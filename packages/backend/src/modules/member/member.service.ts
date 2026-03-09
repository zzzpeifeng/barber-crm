import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async create(createMemberDto: Partial<Member>) {
    const member = this.memberRepo.create(createMemberDto);
    return this.memberRepo.save(member);
  }

  async findAll(shopId?: number) {
    const where = shopId ? { shopId } : {};
    return this.memberRepo.find({
      where,
      relations: ['shop'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.memberRepo.findOne({
      where: { id },
      relations: ['shop', 'pointsSummary', 'storeLogs'],
    });
  }

  async update(id: number, updateMemberDto: Partial<Member>) {
    await this.memberRepo.update(id, updateMemberDto);
    return this.memberRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.memberRepo.delete(id);
  }

  async findByPhone(phone: string, shopId: number) {
    return this.memberRepo.findOne({
      where: { phone, shopId },
      relations: ['shop', 'pointsSummary'],
    });
  }
}