import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MerchantUserService } from './merchant-user.service';
import { MerchantUser } from '../../entities/merchant-user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';

@Controller('merchant-users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MerchantUserController {
  constructor(private readonly merchantUserService: MerchantUserService) {}

  @Post()
  @Roles('super_admin')
  create(@Body() createMerchantUserDto: Partial<MerchantUser>) {
    return this.merchantUserService.create(createMerchantUserDto);
  }

  @Get()
  @Roles('super_admin')
  findAll() {
    return this.merchantUserService.findAll();
  }

  @Get(':id')
  @Roles('super_admin')
  findOne(@Param('id') id: string) {
    return this.merchantUserService.findOne(+id);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() updateMerchantUserDto: Partial<MerchantUser>) {
    return this.merchantUserService.update(+id, updateMerchantUserDto);
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.merchantUserService.remove(+id);
  }
}
