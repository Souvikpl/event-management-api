import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) throw new BadRequestException('Invalid credentials');
    const valid = await (user as any).comparePassword(body.password);
    if (!valid) throw new BadRequestException('Invalid credentials');
    return this.authService.login(user);
  }
}
