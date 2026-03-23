import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── REGISTER ───────────────────────────────────────────
  async register(dto: RegisterDto) {
    // verify if the email is already registered
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyName: dto.companyName,
        role: 'ORGANIZER', // The public registrarion always create organizer users
      },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  // ─── LOGIN ──────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.signToken(user.id, user.email, user.role);
  }

  // ─── GOOGLE OAuth ────────────────────────────────────────
  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    // search if the user already exist by email, if exist we ignore the googleId, if not we create a new user with the googleId
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    // if don't exist, create a new user with the googleId, we set a random password because the user will login with google, the password is not important
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.googleId,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          role: 'ORGANIZER',
        },
      });
    }

    return this.signToken(user.id, user.email, user.role);
  }

  // ─── ACTIVATE STAFF ACCOUNT ─────────────────────────────
  // the staff receives a link with their email as a simple token
  // in production this should be a signed JWT
  async activateStaff(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== 'STAFF') {
      throw new NotFoundException('User not fouend or not a staff member');
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    return { message: 'Account activated successfully' };
  }

  // ─── HELPER: generate JWT ─────────────────────────────────
  private signToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwt.sign(payload),
      role,
    };
  }
}