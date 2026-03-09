import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles('super_admin')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('users/:id')
  @Roles('super_admin')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }
}