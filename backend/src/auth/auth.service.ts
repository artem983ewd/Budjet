import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJwtPayload, ITokenResponse, IJwtConfig } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      void password;
      return result;
    }
    return null;
  }

  private getJwtConfig(): IJwtConfig {
    return {
      accessSecret:
        this.configService.get<string>('JWT_ACCESS_SECRET') || 'default_secret',
      refreshSecret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'default_refresh_secret',
      accessExpires: '15m',
      refreshExpires: '7d',
    };
  }

  async login(loginDto: LoginDto): Promise<ITokenResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: IJwtPayload = { sub: user.id, email: user.email };
    const config = this.getJwtConfig();

    return {
      access_token: this.jwtService.sign(payload, {
        secret: config.accessSecret,
        expiresIn: config.accessExpires,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: config.refreshSecret,
        expiresIn: config.refreshExpires,
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<ITokenResponse> {
    const username = registerDto.firstName + ' ' + registerDto.lastName;
    const user = await this.usersService.register({
      username,
      email: registerDto.email,
      password: registerDto.password,
    });

    const payload: IJwtPayload = { sub: user.id, email: user.email };
    const config = this.getJwtConfig();

    return {
      access_token: this.jwtService.sign(payload, {
        secret: config.accessSecret,
        expiresIn: config.accessExpires,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: config.refreshSecret,
        expiresIn: config.refreshExpires,
      }),
    };
  }

  async refresh(refreshToken: string): Promise<ITokenResponse> {
    try {
      const config = this.getJwtConfig();
      const payload = this.jwtService.verify<IJwtPayload>(refreshToken, {
        secret: config.refreshSecret,
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const newPayload: IJwtPayload = { sub: user.id, email: user.email };

      return {
        access_token: this.jwtService.sign(newPayload, {
          secret: config.accessSecret,
          expiresIn: config.accessExpires,
        }),
        refresh_token: this.jwtService.sign(newPayload, {
          secret: config.refreshSecret,
          expiresIn: config.refreshExpires,
        }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
