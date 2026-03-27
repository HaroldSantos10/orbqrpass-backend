import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login a organizer or staffuser' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // redirige a Google para autenticación
  @ApiOperation({ summary: 'Login with Google' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Google llama a esta URL después de autenticar
  @ApiOperation({ summary: 'Google authentication callback' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const result = await this.authService.googleLogin(req.user);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}&role=${result.role}`
    );
  }

  @ApiOperation({ summary: 'Activate a staff user (only for organizers)' })
  @Post('staff/activate')
  activateStaff(@Body() body: { email: string; password: string }) {
    return this.authService.activateStaff(body.email, body.password);
  }

  


}