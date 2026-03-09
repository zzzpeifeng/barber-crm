import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../../entities/admin-user.entity';
import { MerchantUser } from '../../entities/merchant-user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(AdminUser)
    private adminUserRepo: Repository<AdminUser>,
    @InjectRepository(MerchantUser)
    private merchantUserRepo: Repository<MerchantUser>,
  ) {}

  async adminLogin(loginDto: LoginDto) {
    const admin = await this.adminUserRepo.findOne({
      where: { username: loginDto.username },
    });

    if (!admin || !(await bcrypt.compare(loginDto.password, admin.passwordHash))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = {
      sub: admin.id,
      username: admin.username,
      role: admin.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    };
  }

  async merchantLogin(loginDto: LoginDto) {
    const merchantUser = await this.merchantUserRepo.findOne({
      where: { username: loginDto.username },
      relations: ['merchant'],
    });

    if (!merchantUser || !(await bcrypt.compare(loginDto.password, merchantUser.passwordHash))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (merchantUser.status !== 1) {
      throw new UnauthorizedException('账户已被禁用');
    }

    const payload = {
      sub: merchantUser.id,
      username: merchantUser.username,
      role: merchantUser.role,
      merchantId: merchantUser.merchantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: merchantUser.id,
        username: merchantUser.username,
        role: merchantUser.role,
        merchantId: merchantUser.merchantId,
      },
    };
  }

  async logout() {
    return {
      success: true,
      message: '退出登录成功'
    };
  }
}