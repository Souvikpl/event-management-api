import { Controller, Post, Body, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const exists = await this.usersService.findByEmail(body.email);
    if (exists) throw new BadRequestException('Email already in use');
    const user = await this.usersService.create(body);
    return { id: user._id, email: user.email, name: user.name, role: user.role };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    const user = await this.usersService.findById(req.user._id);
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  }
}
