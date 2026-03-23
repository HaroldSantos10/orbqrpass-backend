import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // redirige a Google para autenticación
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Google llama a esta URL después de autenticar
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Post('staff/activate')
  activateStaff(@Body() body: { email: string; password: string }) {
    return this.authService.activateStaff(body.email, body.password);
  }
}