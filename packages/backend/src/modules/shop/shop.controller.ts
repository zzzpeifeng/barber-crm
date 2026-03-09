import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Shop } from '../../entities/shop.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Merchant } from '../../common/decorators/merchant.decorator';

@Controller('shops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @Roles('super_admin', 'owner')
  create(@Body() createShopDto: Partial<Shop>, @Merchant() merchantId?: number) {
    return this.shopService.create({ ...createShopDto, merchantId });
  }

  @Get()
  findAll(@Query('merchantId') merchantId?: number) {
    return this.shopService.findAll(merchantId ? +merchantId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch(':id')
  @Roles('super_admin', 'owner')
  update(@Param('id') id: string, @Body() updateShopDto: Partial<Shop>) {
    return this.shopService.update(+id, updateShopDto);
  }

  @Delete(':id')
  @Roles('super_admin', 'owner')
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}