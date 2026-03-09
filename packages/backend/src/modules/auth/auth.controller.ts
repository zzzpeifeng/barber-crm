import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('login')
  async merchantLogin(@Body() loginDto: LoginDto) {
    return this.authService.merchantLogin(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return this.authService.logout();
  }
}