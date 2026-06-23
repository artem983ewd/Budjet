import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      authService.login.mockResolvedValue(expectedResponse);

      const result = await authController.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return tokens on successful registration', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'newuser@example.com',
        password: 'password123',
      };
      const expectedResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      authService.register.mockResolvedValue(expectedResponse);

      const result = await authController.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refresh', () => {
    it('should return new tokens on valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const expectedResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };
      authService.refresh.mockResolvedValue(expectedResponse);

      const result = await authController.refresh(refreshToken);

      expect(result).toEqual(expectedResponse);
      expect(authService.refresh).toHaveBeenCalledWith(refreshToken);
    });
  });
});
