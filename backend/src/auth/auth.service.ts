import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJwtPayload, ITokenResponse, IJwtConfig } from './interfaces';
import { ConsoleLogger } from '@nestjs/common';

@Injectable()
export class AuthService extends ConsoleLogger {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(AuthService.name);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
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
    const isPasswordValid = user.password
      ? await bcrypt.compare(loginDto.password, user.password)
      : false;
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

  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    username: string;
    avatar?: string;
  }): Promise<ITokenResponse> {
    this.log(`googleLogin called with: ${JSON.stringify(googleUser)}`);
    const user = await this.usersService.findByEmail(googleUser.email);
    this.log(`Found user by email: ${JSON.stringify(user?.id)}`);

    if (!user) {
      this.log('Creating new user...');
      const newUser = await this.usersService.register({
        username: googleUser.username,
        email: googleUser.email,
        password: '',
        googleId: googleUser.googleId,
      });
      this.log(`New user created: ${newUser.id}`);
      const payload: IJwtPayload = { sub: newUser.id, email: newUser.email };
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

    if (!user.googleId) {
      this.log(
        `Linking existing user ${user.id} to Google ID ${googleUser.googleId}`,
      );
      const existingGoogleUser = await this.usersService.findByGoogleId(
        googleUser.googleId,
      );
      if (existingGoogleUser && existingGoogleUser.id !== user.id) {
        throw new UnauthorizedException(
          'Google account already linked to another user',
        );
      }
      await this.usersService.updateGoogleId(user.id, googleUser.googleId);
    }

    const payload: IJwtPayload = { sub: user.id, email: user.email };
    const config = this.getJwtConfig();
    this.log(`Returning tokens for user: ${user.id}`);

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

  async verifyGoogleToken(googleToken: string): Promise<ITokenResponse> {
    this.log(
      `verifyGoogleToken called with token: ${googleToken ? googleToken.substring(0, 50) + '...' : 'EMPTY/UNDEFINED'}`,
    );
    const { OAuth2Client } = require('google-auth-library');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.log(`GOOGLE_CLIENT_ID: ${clientId}`);

    if (!clientId) {
      this.error('GOOGLE_CLIENT_ID is not configured');
      throw new UnauthorizedException('Google OAuth not configured');
    }

    if (!googleToken || typeof googleToken !== 'string') {
      this.error(
        `Invalid token received: ${googleToken} (type: ${typeof googleToken})`,
      );
      throw new UnauthorizedException('Invalid Google token format');
    }

    const client = new OAuth2Client(clientId);

    try {
      this.log('Verifying Google token...');
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      this.log(`Token payload: ${JSON.stringify(payload?.email)}`);
      const googleUser = {
        googleId: payload['sub'],
        email: payload['email'],
        username: payload['name'] || payload['email'],
        avatar: payload['picture'],
      };

      return this.googleLogin(googleUser);
    } catch (error: any) {
      this.error(`Token verification failed: ${error?.message || error}`);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async verifyGoogleAccessToken(accessToken: string): Promise<ITokenResponse> {
    this.log(
      `verifyGoogleAccessToken called with: ${accessToken ? accessToken.substring(0, 30) + '...' : 'EMPTY'}`,
    );

    try {
      this.log('Fetching user info from Google...');
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.error(`Google userinfo error: ${response.status} - ${errorText}`);
        throw new UnauthorizedException('Invalid Google access token');
      }

      const userInfo = await response.json();
      this.log(
        `Google user info: ${JSON.stringify({ sub: userInfo.sub, email: userInfo.email, name: userInfo.name })}`,
      );

      const googleUser = {
        googleId: userInfo.sub,
        email: userInfo.email,
        username: userInfo.name || userInfo.email,
        avatar: userInfo.picture,
      };

      return this.googleLogin(googleUser);
    } catch (error: any) {
      this.error(
        `Google access token verification failed: ${error?.message || error}`,
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify Google access token');
    }
  }
}
