import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../../entities/store.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @Roles('super_admin', 'owner', 'manager')
  create(@Body() createStoreDto: Partial<Store>) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll(@Query('shopId') shopId?: number) {
    return this.storeService.findAll(shopId ? +shopId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  @Roles('super_admin', 'owner', 'manager')
  update(@Param('id') id: string, @Body() updateStoreDto: Partial<Store>) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  @Roles('super_admin', 'owner', 'manager')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}