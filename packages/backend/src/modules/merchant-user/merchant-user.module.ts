import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantUserController } from './merchant-user.controller';
import { MerchantUserService } from './merchant-user.service';
import { MerchantUser } from '../../entities/merchant-user.entity';
import { Merchant } from '../../entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantUser, Merchant])],
  controllers: [MerchantUserController],
  providers: [MerchantUserService],
  exports: [MerchantUserService],
})
export class MerchantUserModule {}
