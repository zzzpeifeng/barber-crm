import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Merchant } from '../../entities/merchant.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';

@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  @Roles('super_admin')
  create(@Body() createMerchantDto: Partial<Merchant>) {
    return this.merchantService.create(createMerchantDto);
  }

  @Get()
  @Roles('super_admin')
  findAll() {
    return this.merchantService.findAll();
  }

  @Get(':id')
  @Roles('super_admin')
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(+id);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() updateMerchantDto: Partial<Merchant>) {
    return this.merchantService.update(+id, updateMerchantDto);
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.merchantService.remove(+id);
  }
}