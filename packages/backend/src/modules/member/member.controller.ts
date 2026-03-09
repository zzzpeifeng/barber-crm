import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from '../../entities/member.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @Roles('super_admin', 'owner', 'manager', 'staff')
  create(@Body() createMemberDto: Partial<Member>) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  findAll(@Query('shopId') shopId?: number) {
    return this.memberService.findAll(shopId ? +shopId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  @Roles('super_admin', 'owner', 'manager', 'staff')
  update(@Param('id') id: string, @Body() updateMemberDto: Partial<Member>) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  @Roles('super_admin', 'owner', 'manager')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }

  @Get('search/by-phone')
  findByPhone(@Query('phone') phone: string, @Query('shopId') shopId: number) {
    return this.memberService.findByPhone(phone, +shopId);
  }
}