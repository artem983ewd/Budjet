import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Req,
  UseGuards,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: any) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const tokens = await this.authService.googleLogin(req.user);
    res.redirect(
      `${frontendUrl}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    );
  }

  @Post('google/token')
  @HttpCode(HttpStatus.OK)
  async googleToken(@Body() body: { accessToken: string }) {
    const { accessToken } = body;
    if (!accessToken) {
      throw new UnauthorizedException('Google access token is required');
    }
    return this.authService.verifyGoogleAccessToken(accessToken);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
