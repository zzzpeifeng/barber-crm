import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: string;
    merchantId?: number;
  };
}