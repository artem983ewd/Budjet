import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser: Partial<User> = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    username: 'John Doe',
    password: '$2b$10$hashedpassword',
    googleId: null,
  };

  beforeEach(async () => {
    const mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('register', () => {
    const createUserDto = {
      username: 'John Doe',
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should create a new user with hashed password', async () => {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const savedUser = {
        ...mockUser,
        ...createUserDto,
        password: hashedPassword,
      };
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(savedUser as User);

      const result = await usersService.register(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: createUserDto.email,
        username: createUserDto.username,
        googleId: mockUser.googleId,
      });
      expect(result).not.toHaveProperty('password');
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      await expect(usersService.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      const result = await usersService.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return null when user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await usersService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      const result = await usersService.findById('user-uuid-123');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-uuid-123' });
    });

    it('should return null when user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await usersService.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return string message', () => {
      const result = usersService.findAll();

      expect(result).toBe('This action returns all users');
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      const result = await usersService.findOne('user-uuid-123');

      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should return string message with user id', () => {
      const result = usersService.remove('user-uuid-123');

      expect(result).toBe('This action removes a #user-uuid-123 user');
    });
  });
});
